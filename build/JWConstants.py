class ansi:
    red = '\033[91m'
    green = '\033[92m'
    blue = '\033[94m'
    yellow = '\033[93m'
    magenta = '\033[35m'
    cyan = '\033[96m'
    bold = '\033[1m'
    underline = '\033[4m'
    end = '\033[0m'
    white = '\033[97m'
    black = '\033[90m'
    blink = '\033[5m'
    invert = '\033[7m'

class regex:
    hyperlink = r'\[(.*?)\]\((.*?)\)'
    code_block = r'```[\s\S]*?```'
    inline_code = r'`[^`]*`'
    url = r'^https?://\S+$'
    word = r"\b[a-zA-Z']+\b"
    filename_date = r'(\d{4}-\d{2}-\d{2})'