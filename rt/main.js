let term_options =
{
    convertEol: true
    , cursorBlink: true
    , fontSize: 16
    , fontWeight: '700'
    , theme:
    {
        foreground: '#4E9A05'
        , background: '#000b00'
        , cursor: '#4E9A05'

    }
}

let term = new xterm.Terminal(term_options) //{fontFamily: "Courier", fontSize: 24});

let term_prompt = "troupe-web> ";

let line_buffer = []
let cursor_pos = 0
let eol = 0

function handlePrintable(c) {
    term.write(c);
    // Save cursor pos
    term.write('\x1b[s');
    line_buffer.splice(cursor_pos, 0, c);
    cursor_pos++;
    eol++;
    // Delete right
    term.write('\x1b[K');
    // Fill right
    for (i = cursor_pos; i < line_buffer.length; i++)
        term.write(line_buffer[i]);
    // Restore cursor pos
    term.write('\x1b[u');
}

function deleteAtCursor() {
    // Save cursor pos
    term.write('\x1b[s');
    // Delete right
    term.write('\x1b[K');
    // Fill right
    for (i = cursor_pos; i < line_buffer.length; i++)
        term.write(line_buffer[i]);
    // Restore cursor pos
    term.write('\x1b[u');
}


function handleNonprintable(code, key) {
    switch (code) {
        case 13: // Enter
            //handleCommand(); // should read what is on the line.
            term.write('\n' + term_prompt);
            line_buffer.push('\n' + term_prompt);

            if (__getcharCb != null)
                __getcharCb(line_buffer.reverse());

            line_buffer = [];
            cursor_pos = 0;
            eol = 0;
            break;

        case 35: // End
            term.write('\x1b[' + (eol - cursor_pos) + 'C');
            cursor_pos = eol;
            break;

        case 36: // Home           
            term.write('\x1b[' + cursor_pos + 'D');
            cursor_pos = 0;
            break;

        case 37: // Left arrow
            if (cursor_pos > 0) {
                term.write(key);
                cursor_pos--;
            }
            break;

        case 39: // Right arrow
            if (cursor_pos < eol) {
                term.write(key);
                cursor_pos++;
            }
            break;

        case 8: // Backspace
            if (cursor_pos > 0) {
                cursor_pos--;
                eol--;
                line_buffer.splice(cursor_pos, 1);

                // Backspace in terminal
                term.write('\b \b');

                deleteAtCursor();
            }
            break;

        case 46: // Delete
            if (cursor_pos < eol) {
                eol--;
                line_buffer.splice(cursor_pos, 1);

                deleteAtCursor();
            }
            break;

        default:
    }
}

term.on('key', (key, e) => {
    console.log("KeyCode:" + e.keyCode + ", CharCode: " + e.charCode);
    if (e.charCode != 0)
        handlePrintable(key);
    else
        handleNonprintable(e.keyCode, key);
})

term.open(document.getElementById('div'));
term.fit();
window.addEventListener('resize', function () { term.fit(); });

__terminal = term;

function main() {
    term.write(term_prompt);
}
main()