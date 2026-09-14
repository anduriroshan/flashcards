import re
import json
import os

with open(r'c:\Users\rosha\Downloads\gcpmle-flashcards\extracted_text.txt', 'r', encoding='utf-8') as f:
    content = f.read()

parts = re.split(r'User prompt:', content)
print(f"Total parts found: {len(parts) - 1}")

def clean_noise(text):
    text = re.sub(r'--- PAGE \d+ ---', '', text)
    text = re.sub(r'\d{2}/\d{2}/\d{4},\s*\d{2}:\d{2}', '', text)
    text = re.sub(r'Cost-Effective Model Drift Monitoring', '', text)
    text = re.sub(r'https://gemini\.google\.com/app/[a-f0-9]+', '', text)
    text = re.sub(r'^\s*\d+/\d+\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Question \d+ of 50', '', text)
    text = re.sub(r'Mark for Review|Mark for Revie|Mark for Re|PMar\b|PMark\b', '', text)
    lines = [l.strip() for l in text.splitlines()]
    clean_lines = [l for l in lines if l]
    return " ".join(clean_lines)

def categorize(text):
    t = text.lower()
    if any(k in t for k in ['drift', 'monitoring', 'skew', 'alert', 'model monitoring']):
        return 'Monitoring & Drift'
    if any(k in t for k in ['pipeline', 'kfp', 'kubeflow', 'cloud build', 'scheduler', 'ci/cd', 'artifact registry', 'vpc', 'container']):
        return 'MLOps & CI/CD'
    if any(k in t for k in ['gemini', 'llm', 'rag', 'vector search', 'autosxs', 'distill', 'prompt', 'agent search', 'generative', 'tensorboard', 'experiment']):
        return 'GenAI & LLMs'
    if any(k in t for k in ['feature store', 'bigquery', 'dataflow', 'pub/sub', 'streaming', 'arima_plus', 'sql']):
        return 'Data & Feature Engineering'
    if any(k in t for k in ['gpu', 'tpu', 'parallelism', 'slurm', 'lustre', 'autoscaling', 'endpoint', 'batch inference', 'latency']):
        return 'Serving & Distributed Infra'
    return 'ML Systems & Modeling'

def parse_points(text):
    if not text:
        return []
    
    # Clean leading intro phrases
    text = re.sub(r'^(?:for your scenario|for this scenario|why this is the best approach|why this is the correct approach|why this is the recommended approach)[:\.\s]*', '', text, flags=re.IGNORECASE).strip()
    
    # Check for "Option X" style
    opt_pattern = r'(?:^|\.\s+)(Option\s+\d[^\.\:\n]*?)[\:\.]\s*'
    opt_splits = list(re.finditer(opt_pattern, text))
    if len(opt_splits) >= 2:
        points = []
        for idx, m in enumerate(opt_splits):
            title = m.group(1).strip()
            start = m.end()
            end = opt_splits[idx+1].start() if idx + 1 < len(opt_splits) else len(text)
            content = text[start:end].strip()
            points.append({"title": title, "content": content})
        return points

    # Heading: Content style
    pattern = r'(?:^|\.\s+|\n+)([A-Z][A-Za-z0-9\s\/\-\(\)\'\’\.\,\"\”\“\_]{2,120})\s*:\s*'
    splits = list(re.finditer(pattern, text))
    if splits:
        points = []
        for idx, m in enumerate(splits):
            title = m.group(1).strip()
            start = m.end()
            end = splits[idx+1].start() if idx + 1 < len(splits) else len(text)
            content = text[start:end].strip()
            if content:
                points.append({"title": title, "content": content})
        return points

    return [{"title": "Analysis", "content": text}]

cards = []

for i in range(1, 51):
    part = parts[i]
    q_part, a_part = part.split('Response:', 1)
    q_raw = clean_noise(q_part)
    a_raw = clean_noise(a_part)
    
    # Find question stem vs options
    q_pattern = r'(\b(?:What should you do\?|How should you [^\?]+\?|Which [^\?]+\?|What approach should you take\?|What is the best [^\?]+\?|How can you [^\?]+\?|What should be your next step\?|How should you configure [^\?]+\?))'
    q_match = list(re.finditer(q_pattern, q_raw))
    
    if q_match:
        last_m = q_match[-1]
        full_stem = q_raw[:last_m.end()].strip()
        scenario = q_raw[:last_m.start()].strip()
        prompt = q_raw[last_m.start():last_m.end()].strip()
        options_text = q_raw[last_m.end():].strip()
    else:
        last_qm = q_raw.rfind('?')
        if last_qm != -1:
            full_stem = q_raw[:last_qm+1].strip()
            scenario = q_raw[:last_qm+1].strip()
            prompt = "What should you do?"
            options_text = q_raw[last_qm+1:].strip()
        else:
            full_stem = q_raw
            scenario = q_raw
            prompt = "What should you do?"
            options_text = ""

    # Correct answer extraction
    ans_m = re.search(r'The correct (?:approach|answer|solution|method) is(?:\s*:\s*|\s+to\s+|\s+)(.+?)(?=(?:Here is why|Why this is|Here\'s why|\. Here is why|\. Why this is))', a_raw, re.IGNORECASE)
    if ans_m:
        correct_ans = ans_m.group(1).strip()
    else:
        first_why = re.search(r'(?:Here is why|Why this is|Here\'s why)', a_raw, re.IGNORECASE)
        if first_why:
            correct_ans = a_raw[:first_why.start()].strip()
            correct_ans = re.sub(r'^The correct (?:approach|answer|solution|method) is(?:\s*:\s*|\s+to\s+|\s+)', '', correct_ans, flags=re.IGNORECASE).strip()
        else:
            correct_ans = a_raw[:200]

    if correct_ans.endswith('.'):
        correct_ans = correct_ans[:-1].strip()

    # Capitalize first letter of correct answer for clean presentation
    if correct_ans and len(correct_ans) > 1:
        correct_ans = correct_ans[0].upper() + correct_ans[1:]

    # Separate why correct vs why distractors
    why_other_split = re.search(r'(?:Here is why the other options fall short|Why the other options fall short|Here\'s why the other options fall short|Why the other options are incorrect|Here is why the other options are incorrect)[:\.]?', a_raw, re.IGNORECASE)
    why_correct_split = re.search(r'(?:Here is why this is the best solution|Why this is the correct approach|Here is why this is the correct approach|Why this is the best approach|Why this is the recommended approach)[:\.]?', a_raw, re.IGNORECASE)

    why_correct_text = ""
    why_distractors_text = ""

    if why_other_split:
        why_distractors_text = a_raw[why_other_split.end():].strip()
        if why_correct_split:
            why_correct_text = a_raw[why_correct_split.end():why_other_split.start()].strip()
        else:
            why_correct_text = a_raw[ans_m.end():why_other_split.start()].strip() if ans_m else ""
    else:
        if why_correct_split:
            why_correct_text = a_raw[why_correct_split.end():].strip()
        else:
            why_correct_text = a_raw

    correct_points = parse_points(why_correct_text)
    distractor_points = parse_points(why_distractors_text)

    cards.append({
        'id': i,
        'category': categorize(full_stem),
        'scenario': scenario,
        'prompt': prompt,
        'options_text': options_text,
        'correct_answer': correct_ans,
        'why_correct': correct_points,
        'why_distractors': distractor_points
    })

# Save JSON
out_dir = r'c:\Users\rosha\Downloads\gcpmle-flashcards'
json_path = os.path.join(out_dir, 'cards_data.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(cards, f, indent=2, ensure_ascii=False)

# Save JS file
js_path = os.path.join(out_dir, 'cards_data.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write("// Google Cloud Professional Machine Learning Engineer Flashcard Data (50 Questions)\n")
    f.write("const CARDS_DATA = ")
    f.write(json.dumps(cards, indent=2, ensure_ascii=False))
    f.write(";\n")

print(f"Generated cards_data.json and cards_data.js with {len(cards)} questions.")
