// ===== GLOBALS =====
let pyodide = null;
let pyodideReady = false;
const editors = {};

// ===== PYODIDE INITIALIZATION =====
async function initPyodide() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        pyodideReady = true;
        statusDot.classList.remove('loading');
        statusText.textContent = 'Pyodide Ready';
    } catch (err) {
        statusDot.classList.remove('loading');
        statusDot.classList.add('error');
        statusText.textContent = 'Pyodide Failed';
        console.error('Pyodide load error:', err);
    }
}

// ===== MONACO EDITOR INITIALIZATION =====
function initMonaco() {
    require.config({
        paths: {
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
        }
    });

    require(['vs/editor/editor.main'], function () {
        // Define Catppuccin Light theme (for code editor in light mode)
        monaco.editor.defineTheme('catppuccin-light', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6c7086', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'cba6f7' },
                { token: 'string', foreground: 'a6e3a1' },
                { token: 'number', foreground: 'fab387' },
                { token: 'type', foreground: '89dceb' },
                { token: 'function', foreground: '89b4fa' },
                { token: 'variable', foreground: 'cdd6f4' },
                { token: 'operator', foreground: '94e2d5' },
                { token: 'delimiter', foreground: '9399b2' },
                { token: 'identifier', foreground: 'cdd6f4' },
                { token: 'decorator', foreground: 'f9e2af' },
            ],
            colors: {
                'editor.background': '#1e1e2e',
                'editor.foreground': '#cdd6f4',
                'editor.lineHighlightBackground': '#2a2b3d',
                'editor.selectionBackground': '#45475a',
                'editorCursor.foreground': '#f5e0dc',
                'editorLineNumber.foreground': '#585b70',
                'editorLineNumber.activeForeground': '#a6adc8',
                'editor.inactiveSelectionBackground': '#313244',
                'editorIndentGuide.background': '#313244',
                'editorIndentGuide.activeBackground': '#45475a',
                'scrollbar.shadow': '#00000000',
                'editorScrollbar.background': '#1e1e2e',
            }
        });

        // Define Catppuccin Dark theme (for code editor in dark mode)
        monaco.editor.defineTheme('catppuccin-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '585b70', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'b4a0e5' },
                { token: 'string', foreground: '8ccf8c' },
                { token: 'number', foreground: 'e8a66a' },
                { token: 'type', foreground: '7ac8d8' },
                { token: 'function', foreground: '7aa2f7' },
                { token: 'variable', foreground: 'bcc4e0' },
                { token: 'operator', foreground: '82d9c5' },
                { token: 'delimiter', foreground: '6c6f85' },
                { token: 'identifier', foreground: 'bcc4e0' },
                { token: 'decorator', foreground: 'e0c97a' },
            ],
            colors: {
                'editor.background': '#111118',
                'editor.foreground': '#bcc4e0',
                'editor.lineHighlightBackground': '#1a1a24',
                'editor.selectionBackground': '#2e2e42',
                'editorCursor.foreground': '#e0c97a',
                'editorLineNumber.foreground': '#3a3a4e',
                'editorLineNumber.activeForeground': '#6c6f85',
                'editor.inactiveSelectionBackground': '#222233',
                'editorIndentGuide.background': '#222233',
                'editorIndentGuide.activeBackground': '#333348',
                'scrollbar.shadow': '#00000000',
                'editorScrollbar.background': '#111118',
            }
        });

        // Determine initial theme
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const initialTheme = isDark ? 'catppuccin-dark' : 'catppuccin-light';

        // Create editors for all editor wrappers
        const wrappers = document.querySelectorAll('.editor-wrapper');
        wrappers.forEach(wrapper => {
            const id = wrapper.id;
            const defaultCode = wrapper.getAttribute('data-default') || '# Write your Python code here\n';

            const editor = monaco.editor.create(wrapper, {
                value: defaultCode,
                language: 'python',
                theme: initialTheme,
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                lineHeight: 22,
                padding: { top: 14, bottom: 14 },
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                automaticLayout: true,
                overviewRulerBorder: false,
                scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                    verticalSliderSize: 6,
                },
                bracketPairColorization: { enabled: true },
            });

            editors[id] = editor;

            // Ctrl+Enter / Cmd+Enter to run
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
                runCode(id);
            });
        });
    });
}

// ===== RUN CODE =====
async function runCode(editorId) {
    if (!pyodideReady) {
        showOutput(editorId, 'Pyodide is still loading... Please wait.', true);
        return;
    }

    const editor = editors[editorId];
    if (!editor) return;

    const code = editor.getValue();
    const btn = document.querySelector(`#${editorId}`).closest('.editor-container').querySelector('.run-btn');

    // Show running state
    btn.classList.add('running');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"><animateTransform attributeName="transform" type="rotate" from="0 7 7" to="360 7 7" dur="0.8s" repeatCount="indefinite"/></circle></svg> Running...`;

    try {
        // Capture stdout
        pyodide.runPython(`
import sys
from io import StringIO
__stdout_capture = StringIO()
sys.stdout = __stdout_capture
`);

        // Run user code
        await pyodide.runPythonAsync(code);

        // Get output
        const output = pyodide.runPython(`
result = __stdout_capture.getvalue()
sys.stdout = sys.__stdout__
result
`);
        showOutput(editorId, output || '(No output)', false);
    } catch (err) {
        // Clean up stdout redirect on error
        try {
            pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
`);
        } catch (e) { /* ignore */ }

        const errorMsg = err.message || String(err);
        // Clean up the error message for readability
        const cleanError = cleanPythonError(errorMsg);
        showOutput(editorId, cleanError, true);
    }

    // Reset button
    btn.classList.remove('running');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1.5v11l9-5.5-9-5.5z" fill="currentColor"/></svg> Run`;
}

function cleanPythonError(error) {
    // Remove Pyodide internal frames, keep relevant info
    const lines = error.split('\n');
    const relevant = [];
    let capture = false;

    for (const line of lines) {
        if (line.includes('PythonError:') || line.includes('Error:') || line.includes('Traceback')) {
            capture = true;
        }
        if (capture) {
            // Skip internal pyodide frames
            if (line.includes('/lib/python') && !line.includes('<exec>')) continue;
            relevant.push(line);
        }
    }

    return relevant.length > 0 ? relevant.join('\n') : error;
}

function showOutput(editorId, text, isError) {
    const container = document.getElementById(`output-${editorId}`);
    if (!container) return;

    const content = container.querySelector('.output-content');
    content.textContent = text;
    content.className = `output-content ${isError ? 'error' : 'success'}`;

    // Scroll output into view with smooth animation
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const contentScroll = document.getElementById('contentScroll');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-section');

            // Update active nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(`section-${target}`);
            if (targetSection) {
                targetSection.classList.add('active');
                contentScroll.scrollTop = 0;
            }

            // Close sidebar on mobile
            closeSidebar();

            // Re-layout editors in the visible section
            setTimeout(() => {
                Object.values(editors).forEach(editor => {
                    editor.layout();
                });
            }, 50);
        });
    });
}

// ===== SIDEBAR MOBILE =====
function initSidebar() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
    });

    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape to close sidebar
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
}

// ===== THEME TOGGLE =====
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('pyoop-theme');

    // Apply saved or system preference
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('pyoop-theme', newTheme);

        // Update Monaco editors theme
        updateEditorThemes(newTheme);
    });
}

function updateEditorThemes(theme) {
    if (typeof monaco !== 'undefined') {
        const monacoTheme = theme === 'dark' ? 'catppuccin-dark' : 'catppuccin-light';
        monaco.editor.setTheme(monacoTheme);
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSidebar();
    initKeyboardShortcuts();
    initMonaco();
    initPyodide();
});
