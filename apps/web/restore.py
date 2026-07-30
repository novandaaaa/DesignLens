import json
import subprocess

transcript_path = r'C:\Users\HYPE AMD\.gemini\antigravity-ide\brain\5228e545-3c7d-4232-b3bd-29b093bb3bbb\.system_generated\logs\transcript_full.jsonl'

def apply_replacements(content, chunks):
    chunks.sort(key=lambda x: x['StartLine'], reverse=True)
    lines = content.split('\n')
    for chunk in chunks:
        start_idx = chunk['StartLine'] - 1
        end_idx = chunk['EndLine']
        replacement_lines = chunk['ReplacementContent'].split('\n')
        lines[start_idx:end_idx] = replacement_lines
    return '\n'.join(lines)

subprocess.run(['git', 'checkout', 'src/app/page.tsx'])
subprocess.run(['git', 'checkout', 'src/app/globals.css'])
subprocess.run(['git', 'checkout', 'src/components/ThreeFloatingObjects.tsx'])

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    page_content = f.read()
    
with open('src/app/globals.css', 'r', encoding='utf-8') as f:
    globals_content = f.read()

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            step = entry.get('step_index', 999999)
            if step > 3228:
                break
                
            if entry.get('type') == 'PLANNER_RESPONSE' and 'tool_calls' in entry:
                for call in entry['tool_calls']:
                    if call['name'] == 'multi_replace_file_content':
                        args = call['args']
                        target = args['TargetFile']
                        chunks = json.loads(args['ReplacementChunks'])
                        
                        if 'page.tsx' in target:
                            page_content = apply_replacements(page_content, chunks)
                        elif 'globals.css' in target:
                            globals_content = apply_replacements(globals_content, chunks)
                            
                    elif call['name'] == 'replace_file_content':
                        args = call['args']
                        target = args['TargetFile']
                        chunk = {
                            'StartLine': args['StartLine'],
                            'EndLine': args['EndLine'],
                            'TargetContent': args['TargetContent'],
                            'ReplacementContent': args['ReplacementContent']
                        }
                        
                        if 'page.tsx' in target:
                            page_content = apply_replacements(page_content, [chunk])
                        elif 'globals.css' in target:
                            globals_content = apply_replacements(globals_content, [chunk])
        except Exception as e:
            pass

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)
    
with open('src/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(globals_content)

print('Files restored to step 3228!')
