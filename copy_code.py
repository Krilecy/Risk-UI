import os

files = os.listdir('src')
files = sorted(files)

text = ""
for file in files:
    if file.endswith('.js') or file.endswith('.css') & (file not in ['copy_code.py']):
        with open(f'src/{file}', mode='r') as f:
            content = f.read()
            text = f'{text}\n\n\n{file}:\n{"=" * (len(file))}=\n\n{content}'

with open('all_code_to_copy.txt', 'w') as output:
    output.write(text.strip())
