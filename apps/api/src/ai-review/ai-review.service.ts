import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface AiCategoryResult {
  score: number;
  reasoning: string;
  recommendations: string[];
}

interface AiReviewResult {
  layout: AiCategoryResult;
  typography: AiCategoryResult;
  color: AiCategoryResult;
  navigation: AiCategoryResult;
  cta: AiCategoryResult;
  accessibility: AiCategoryResult;
  overall_recommendation: string;
}

@Injectable()
export class AiReviewService {
  private readonly apiKey: string;
  private readonly model: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENROUTER_API_KEY', '');
    this.model = this.configService.get<string>('OPENROUTER_MODEL', 'qwen/qwen3-coder:free');
  }

  async createReview(websiteId: string, userId: string) {
    // Verify website exists and belongs to user
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
      include: { screenshots: true, aiReview: true },
    });

    if (!website) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    if (website.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses');
    }

    if (website.aiReview && website.aiReview.status === 'PROCESSING') {
      throw new BadRequestException('AI Review sedang diproses');
    }

    // Create or update AI review record with PROCESSING status
    const aiReview = await this.prisma.aiReview.upsert({
      where: { websiteId },
      create: {
        websiteId,
        status: 'PROCESSING',
      },
      update: {
        status: 'PROCESSING',
        layoutScore: null,
        typographyScore: null,
        colorScore: null,
        navigationScore: null,
        ctaScore: null,
        accessibilityScore: null,
        overallScore: null,
        reasoning: Prisma.DbNull,
        recommendation: null,
      },
    });

    // Process in background (non-blocking)
    this.processReview(websiteId, website.url, website.description ?? '').catch(
      (error) => {
        console.error(`AI Review failed for website ${websiteId}:`, error);
        this.prisma.aiReview.update({
          where: { websiteId },
          data: { status: 'FAILED' },
        });
      },
    );

    return {
      message: 'AI Review sedang diproses',
      reviewId: aiReview.id,
      status: 'PROCESSING',
    };
  }

  async getReview(websiteId: string, userId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    if (website.userId !== userId) {
      throw new ForbiddenException('Hasil AI Review hanya bisa dilihat oleh pemilik website');
    }

    const review = await this.prisma.aiReview.findUnique({
      where: { websiteId },
    });

    if (!review) {
      throw new NotFoundException('AI Review belum dibuat');
    }

    return review;
  }

  private async processReview(websiteId: string, url: string, description: string) {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const prompt = this.buildPrompt(url, description);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://designlens.id',
        'X-Title': 'DesignLens AI',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional UI/UX reviewer. Analyze websites and provide structured feedback in JSON format. Always respond with valid JSON only, no markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI model');
    }

    // Parse AI response
    let reviewResult: AiReviewResult;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      reviewResult = JSON.parse(jsonStr.trim());
    } catch {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Calculate overall score
    const scores = [
      reviewResult.layout?.score ?? 0,
      reviewResult.typography?.score ?? 0,
      reviewResult.color?.score ?? 0,
      reviewResult.navigation?.score ?? 0,
      reviewResult.cta?.score ?? 0,
      reviewResult.accessibility?.score ?? 0,
    ];
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Update review in database
    await this.prisma.aiReview.update({
      where: { websiteId },
      data: {
        status: 'COMPLETED',
        layoutScore: reviewResult.layout?.score ?? 0,
        typographyScore: reviewResult.typography?.score ?? 0,
        colorScore: reviewResult.color?.score ?? 0,
        navigationScore: reviewResult.navigation?.score ?? 0,
        ctaScore: reviewResult.cta?.score ?? 0,
        accessibilityScore: reviewResult.accessibility?.score ?? 0,
        overallScore,
        reasoning: reviewResult as any,
        recommendation: reviewResult.overall_recommendation ?? '',
        modelUsed: this.model,
      },
    });
  }

  private buildPrompt(url: string, description: string): string {
    return `Analyze the UI/UX of this website:

URL: ${url}
${description ? `Description: ${description}` : ''}

Evaluate the following categories on a scale of 0-100 and provide detailed feedback:

1. **Layout** - Visual hierarchy, spacing, alignment, grid usage
2. **Typography** - Font choices, readability, sizing, line height
3. **Color** - Color palette, contrast, consistency, accessibility
4. **Navigation** - Menu structure, ease of use, findability
5. **CTA (Call-to-Action)** - Button visibility, wording, placement
6. **Accessibility** - Alt text, contrast ratios, keyboard navigation, semantic HTML

Respond ONLY with valid JSON in this exact format:
{
  "layout": {
    "score": <0-100>,
    "reasoning": "<detailed explanation>",
    "recommendations": ["<suggestion 1>", "<suggestion 2>"]
  },
  "typography": {
    "score": <0-100>,
    "reasoning": "<detailed explanation>",
    "recommendations": ["<suggestion 1>", "<suggestion 2>"]
  },
  "color": {
    "score": <0-100>,
    "reasoning": "<detailed explanation>",
    "recommendations": ["<suggestion 1>", "<suggestion 2>"]
  },
  "navigation": {
    "score": <0-100>,
    "reasoning": "<detailed explanation>",
    "recommendations": ["<suggestion 1>", "<suggestion 2>"]
  },
  "cta": {
    "score": <0-100>,
    "reasoning": "<detailed explanation>",
    "recommendations": ["<suggestion 1>", "<suggestion 2>"]
  },
  "accessibility": {
    "score": <0-100>,
    "reasoning": "<detailed explanation>",
    "recommendations": ["<suggestion 1>", "<suggestion 2>"]
  },
  "overall_recommendation": "<comprehensive summary and top 3 priority improvements>"
}`;
  }
}
