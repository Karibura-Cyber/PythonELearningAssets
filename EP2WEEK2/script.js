/* ============================================
   PYTHON INTERACTIVE LEARNING - SCRIPT.JS
   Monaco Editor + Pyodide + BigO Visualizer
   ============================================ */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  pyodide: null,
  pyodideReady: false,
  learnEditor: null,
  quizEditor: null,
  currentTopic: 0,
  currentProblem: 0,
  solvedProblems: new Set(),
  score: 0,
  bigoToggles: new Set(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)']),
  nValue: 20,
};

// ── Topics (Learning Content) ──────────────────────────────────────────────
const topics = [
  {
    id: 'list-basics',
    name: 'List Basics',
    icon: '📦',
    color: '#00f5ff',
    badge: 'EP2·W2',
    content: `
<h1>List Methods — หัวใจของ List</h1>
<p>List คือ <strong>กล่องมหัศจรรย์</strong> ที่สามารถเก็บข้อมูลได้หลายอย่างและเป็นระเบียบ เราอ้างอิงสมาชิกด้วย <code class="inline-code">Index</code> (เริ่มต้นที่ 0)</p>

<h2>🔧 Methods ที่ต้องรู้</h2>

<h3>1. .append(x) — เพิ่มของท้ายกล่อง</h3>
<p>เพิ่มสมาชิก <code class="inline-code">x</code> ที่ตำแหน่งสุดท้ายของ List</p>
<div class="code-block"><span class="var">shopping_list</span> = [<span class="str">"Milk"</span>, <span class="str">"Bread"</span>, <span class="str">"Eggs"</span>]
<span class="var">shopping_list</span>.<span class="fn">append</span>(<span class="str">"Cheese"</span>)
<span class="fn">print</span>(<span class="var">shopping_list</span>)  <span class="cmt"># ['Milk', 'Bread', 'Eggs', 'Cheese']</span></div>

<h3>2. .pop() — หยิบของออก</h3>
<p>หยิบสมาชิกตัวสุดท้ายออกจาก List และ <em>คืนค่า</em>ออกมา</p>
<div class="code-block"><span class="var">last_item</span> = <span class="var">shopping_list</span>.<span class="fn">pop</span>()
<span class="fn">print</span>(<span class="var">last_item</span>)      <span class="cmt"># Cheese</span>
<span class="fn">print</span>(<span class="var">shopping_list</span>) <span class="cmt"># ['Milk', 'Bread', 'Eggs']</span></div>

<h3>3. .insert(i, x) — แซงคิว</h3>
<p>เพิ่มสมาชิก <code class="inline-code">x</code> ที่ตำแหน่ง <code class="inline-code">i</code> (ตำแหน่งอื่นจะถูกเลื่อน)</p>
<div class="code-block"><span class="var">shopping_list</span>.<span class="fn">insert</span>(<span class="num">0</span>, <span class="str">"Apple"</span>)  <span class="cmt"># แทรกที่ตำแหน่งแรก</span>
<span class="fn">print</span>(<span class="var">shopping_list</span>)  <span class="cmt"># ['Apple', 'Milk', 'Bread', 'Eggs']</span></div>

<h3>4. .remove(x) — ลบของที่ต้องการ</h3>
<p>ลบสมาชิก <code class="inline-code">x</code> ตัวแรกที่เจอใน List</p>
<div class="code-block"><span class="var">shopping_list</span>.<span class="fn">remove</span>(<span class="str">"Bread"</span>)
<span class="fn">print</span>(<span class="var">shopping_list</span>)  <span class="cmt"># ['Apple', 'Milk', 'Eggs']</span></div>

<div class="info-box note">
<strong>💡 Time Complexity</strong>
append() = O(1) · pop() = O(1) · insert(0,x) = O(n) · remove(x) = O(n)
</div>`,
    starter: `# ทดลองใช้ List Methods
shopping = ["Milk", "Bread", "Eggs"]

# เพิ่ม Cheese
shopping.append("Cheese")
print("After append:", shopping)

# หยิบออก
item = shopping.pop()
print(f"Popped: {item}, List: {shopping}")

# แทรกที่ตำแหน่ง 0
shopping.insert(0, "Apple")
print("After insert:", shopping)

# ลบ Bread
shopping.remove("Bread")
print("After remove:", shopping)`
  },
  {
    id: 'slicing',
    name: 'Slicing',
    icon: '✂️',
    color: '#bf00ff',
    badge: 'EP2·W2',
    content: `
<h1>Slicing — พลังพิเศษในการตัดแบ่งข้อมูล</h1>
<p>Slicing ช่วยให้เราเลือกข้อมูลบางส่วนจาก List หรือ String ได้อย่างง่ายดาย</p>

<h2>📐 Syntax พื้นฐาน</h2>
<div class="code-block"><span class="var">data</span>[<span class="var">start</span>:<span class="var">stop</span>:<span class="var">step</span>]</div>

<h2>🔪 ตัวอย่าง Slicing</h2>
<div class="code-block"><span class="var">data</span> = [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>, <span class="num">50</span>, <span class="num">60</span>]

<span class="cmt"># เลือก Index คู่ (0,2,4) → Step 2</span>
<span class="var">even_idx</span> = <span class="var">data</span>[::<span class="num">2</span>]
<span class="fn">print</span>(<span class="var">even_idx</span>)        <span class="cmt"># [10, 30, 50]</span>

<span class="cmt"># กลับด้าน List</span>
<span class="var">reversed_data</span> = <span class="var">data</span>[::<span class="num">-1</span>]
<span class="fn">print</span>(<span class="var">reversed_data</span>)   <span class="cmt"># [60, 50, 40, 30, 20, 10]</span>

<span class="cmt"># กลับด้านเฉพาะช่วง [4:1:-1]</span>
<span class="var">sub_rev</span> = <span class="var">data</span>[<span class="num">4</span>:<span class="num">1</span>:<span class="num">-1</span>]
<span class="fn">print</span>(<span class="var">sub_rev</span>)         <span class="cmt"># [50, 40, 30]</span></div>

<h2>📋 Shallow Copy</h2>
<p>ใช้ <code class="inline-code">list[:]</code> เพื่อสร้าง List ใหม่ที่เป็นอิสระ (Shallow Copy)</p>
<div class="code-block"><span class="var">original</span> = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>]
<span class="var">copy</span> = <span class="var">original</span>[:]
<span class="var">copy</span>.<span class="fn">append</span>(<span class="num">99</span>)
<span class="fn">print</span>(<span class="var">original</span>)  <span class="cmt"># [1, 2, 3] ← ไม่เปลี่ยน!</span>
<span class="fn">print</span>(<span class="var">copy</span>)      <span class="cmt"># [1, 2, 3, 99]</span></div>

<div class="info-box warn">
<strong>⚠️ ข้อควรระวัง</strong>
ถ้าไม่ Copy: copy = original → การแก้ copy จะแก้ original ด้วย!
</div>`,
    starter: `data = [10, 20, 30, 40, 50, 60]

# 1. เลือก Index คู่
even_idx = data[::2]
print("Even index:", even_idx)

# 2. กลับด้าน
rev = data[::-1]
print("Reversed:", rev)

# 3. Shallow Copy
copy = data[:]
copy.append(999)
print("Original:", data)
print("Copy:", copy)

# 4. ลองของเอง: เลือกครึ่งหลัง
half = data[len(data)//2:]
print("Second half:", half)`
  },
  {
    id: 'list-comprehension',
    name: 'List Comprehension',
    icon: '⚡',
    color: '#39ff14',
    badge: 'EP2·W2',
    content: `
<h1>List Comprehension — สร้าง List ใน 1 บรรทัด</h1>
<p>LC คือ Python's "magic shortcut" ที่ช่วยสร้าง List ใหม่จาก List เดิมได้ในบรรทัดเดียว</p>

<h2>📐 รูปแบบพื้นฐาน</h2>
<div class="code-block">[<span class="var">expression</span> <span class="kw">for</span> <span class="var">item</span> <span class="kw">in</span> <span class="var">iterable</span>]</div>

<h2>⚡ Loop vs LC</h2>
<div class="code-block"><span class="cmt"># แบบ Loop ยาว</span>
<span class="var">squares</span> = []
<span class="kw">for</span> <span class="var">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    <span class="var">squares</span>.<span class="fn">append</span>(<span class="var">i</span> * <span class="var">i</span>)

<span class="cmt"># แบบ LC สั้นกว่า!</span>
<span class="var">squares</span> = [<span class="var">i</span> * <span class="var">i</span> <span class="kw">for</span> <span class="var">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>)]
<span class="fn">print</span>(<span class="var">squares</span>)  <span class="cmt"># [0, 1, 4, 9, 16]</span></div>

<h2>🔍 Filter — การกรองข้อมูล</h2>
<div class="code-block"><span class="var">data</span> = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">8</span>, <span class="num">10</span>, <span class="num">15</span>]

<span class="cmt"># เลือกเฉพาะเลขคู่</span>
<span class="var">even_only</span> = [<span class="var">x</span> <span class="kw">for</span> <span class="var">x</span> <span class="kw">in</span> <span class="var">data</span> <span class="kw">if</span> <span class="var">x</span> % <span class="num">2</span> == <span class="num">0</span>]
<span class="fn">print</span>(<span class="var">even_only</span>)  <span class="cmt"># [2, 8, 10]</span></div>

<h2>🔀 If-Else — เงื่อนไขแบบเลือก</h2>
<div class="code-block"><span class="cmt"># ถ้าเลขคู่ให้คูณ 10, ถ้าคี่ให้คูณ 1</span>
<span class="var">new_data</span> = [<span class="var">x</span>*<span class="num">10</span> <span class="kw">if</span> <span class="var">x</span>%<span class="num">2</span>==<span class="num">0</span> <span class="kw">else</span> <span class="var">x</span>*<span class="num">1</span> <span class="kw">for</span> <span class="var">x</span> <span class="kw">in</span> <span class="var">data</span>]
<span class="fn">print</span>(<span class="var">new_data</span>)  <span class="cmt"># [1, 20, 5, 80, 100, 15]</span></div>

<div class="info-box tip">
<strong>🔑 Key Rule</strong>
Filter (if only) → เงื่อนไขอยู่ท้าย LC
If-Else → เงื่อนไขอยู่หน้า for
</div>`,
    starter: `data = [1, 2, 5, 8, 10, 15]

# 1. สร้าง List ยกกำลังสอง
squares = [x*x for x in range(6)]
print("Squares:", squares)

# 2. กรองเฉพาะเลขคู่
evens = [x for x in data if x % 2 == 0]
print("Evens:", evens)

# 3. If-Else: เลขคู่ x10, เลขคี่ x1
new_data = [x*10 if x%2==0 else x for x in data]
print("Transformed:", new_data)

# 4. แปลงตัวอักษรเป็นพิมพ์ใหญ่
words = ["python", "list", "comprehension"]
upper = [w.upper() for w in words]
print("Upper:", upper)`
  },
  {
    id: 'matrix',
    name: 'Matrix (2D List)',
    icon: '🔢',
    color: '#ff6b35',
    badge: 'EP2·W2',
    content: `
<h1>Matrix — 2D List</h1>
<p>Matrix คือ List ซ้อน List — List ชั้นนอกคือ <strong>แถว (Row)</strong>, List ชั้นในคือ <strong>คอลัมน์ (Column)</strong></p>

<h2>📐 โครงสร้าง</h2>
<div class="code-block"><span class="cmt"># Matrix 3x3</span>
<span class="var">matrix</span> = [
    [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>],  <span class="cmt"># Row 0</span>
    [<span class="num">40</span>, <span class="num">50</span>, <span class="num">60</span>],  <span class="cmt"># Row 1</span>
    [<span class="num">70</span>, <span class="num">80</span>, <span class="num">90</span>]   <span class="cmt"># Row 2</span>
]

<span class="cmt"># เข้าถึง: matrix[row][col]</span>
<span class="fn">print</span>(<span class="var">matrix</span>[<span class="num">1</span>][<span class="num">2</span>])  <span class="cmt"># 60 (Row 1, Col 2)</span></div>

<h2>🏗️ สร้าง Grid ด้วย LC</h2>
<div class="code-block"><span class="cmt"># Grid 3x4 เต็มไปด้วย 0</span>
<span class="var">N</span>, <span class="var">M</span> = <span class="num">3</span>, <span class="num">4</span>
<span class="var">grid</span> = [[<span class="num">0</span>] * <span class="var">M</span> <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="var">N</span>)]
<span class="fn">print</span>(<span class="var">grid</span>)
<span class="cmt"># [[0,0,0,0], [0,0,0,0], [0,0,0,0]]</span></div>

<h2>🔄 Traverse Matrix</h2>
<div class="code-block"><span class="cmt"># วนลูปทุก element</span>
<span class="kw">for</span> <span class="var">row</span> <span class="kw">in</span> <span class="var">matrix</span>:
    <span class="kw">for</span> <span class="var">val</span> <span class="kw">in</span> <span class="var">row</span>:
        <span class="fn">print</span>(<span class="var">val</span>, end=<span class="str">" "</span>)
    <span class="fn">print</span>()  <span class="cmt"># ขึ้นบรรทัดใหม่</span></div>

<h2>📏 Manhattan Distance</h2>
<p>ระยะทางบน Grid ที่เดินได้แค่ขึ้น/ลง/ซ้าย/ขวา:</p>
<div class="code-block"><span class="var">dist</span> = <span class="fn">abs</span>(<span class="var">r2</span> - <span class="var">r1</span>) + <span class="fn">abs</span>(<span class="var">c2</span> - <span class="var">c1</span>)</div>`,
    starter: `# Matrix 3x3
matrix = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]

# เข้าถึง element
print("matrix[1][2] =", matrix[1][2])  # 60

# สร้าง Grid 3x4 ด้วย 0
grid = [[0]*4 for _ in range(3)]
print("Empty grid:", grid)

# ใส่ค่า identity matrix
identity = [[1 if i==j else 0 for j in range(3)] for i in range(3)]
for row in identity:
    print(row)

# Manhattan Distance
r1, c1, r2, c2 = 1, 1, 3, 4
dist = abs(r2-r1) + abs(c2-c1)
print(f"Manhattan Distance: {dist}")`
  },
  {
    id: 'bigo-list',
    name: 'Big-O ของ List',
    icon: '📊',
    color: '#ffe600',
    badge: 'Big-O',
    content: `
<h1>Big-O Notation ของ List Operations</h1>
<p>การเข้าใจ Big-O ช่วยให้เราเลือกใช้ method ที่เหมาะสมกับงาน</p>

<h2>⏱️ Time Complexity ของ List Methods</h2>

<table class="complexity-table">
<thead>
<tr><th>Operation</th><th>Big-O</th><th>คำอธิบาย</th><th>ระดับ</th></tr>
</thead>
<tbody>
<tr><td>list[i]</td><td class="good">O(1)</td><td>เข้าถึงด้วย index ทันที</td><td class="good">ดีมาก</td></tr>
<tr><td>append(x)</td><td class="good">O(1)*</td><td>ต่อท้าย amortized</td><td class="good">ดีมาก</td></tr>
<tr><td>pop()</td><td class="good">O(1)</td><td>เอาออกตัวสุดท้าย</td><td class="good">ดีมาก</td></tr>
<tr><td>pop(0)</td><td class="bad">O(n)</td><td>ต้อง shift ทุก element</td><td class="bad">ช้า</td></tr>
<tr><td>insert(0, x)</td><td class="bad">O(n)</td><td>ต้อง shift ทุก element</td><td class="bad">ช้า</td></tr>
<tr><td>insert(i, x)</td><td class="ok">O(n)</td><td>shift elements หลัง i</td><td class="ok">ปานกลาง</td></tr>
<tr><td>remove(x)</td><td class="bad">O(n)</td><td>ต้อง search + shift</td><td class="bad">ช้า</td></tr>
<tr><td>x in list</td><td class="bad">O(n)</td><td>linear search</td><td class="bad">ช้า</td></tr>
<tr><td>len(list)</td><td class="good">O(1)</td><td>ค่าถูก cache ไว้</td><td class="good">ดีมาก</td></tr>
<tr><td>list[a:b]</td><td class="ok">O(k)</td><td>k = จำนวน elements ที่ copy</td><td class="ok">ปานกลาง</td></tr>
<tr><td>sorted(list)</td><td class="ok">O(n log n)</td><td>Timsort algorithm</td><td class="ok">ปานกลาง</td></tr>
<tr><td>list.sort()</td><td class="ok">O(n log n)</td><td>In-place Timsort</td><td class="ok">ปานกลาง</td></tr>
</tbody>
</table>

<div class="info-box note">
<strong>💡 เคล็ดลับ</strong>
ถ้าต้องการ insert/remove ที่ตำแหน่งแรกบ่อยๆ → ใช้ collections.deque แทน (O(1) ทั้งหัวและท้าย!)
</div>

<div class="info-box warn">
<strong>⚠️ Amortized O(1)</strong>
append() ปกติ O(1) แต่บางครั้ง Python ต้องขยาย array → O(n) แต่ average ยังคง O(1)
</div>`,
    starter: `import time

# ทดสอบความเร็ว append vs insert(0,x)
N = 10000

# append - O(1) amortized
lst = []
t0 = time.time()
for i in range(N):
    lst.append(i)
t1 = time.time()
print(f"append x{N}: {(t1-t0)*1000:.2f} ms")

# insert(0, x) - O(n) ต่อครั้ง!
lst2 = []
t0 = time.time()
for i in range(N):
    lst2.insert(0, i)
t1 = time.time()
print(f"insert(0) x{N}: {(t1-t0)*1000:.2f} ms")

print("insert(0) ช้ากว่า append มาก! เพราะ O(n) vs O(1)")`
  }
];

// ── Quiz Problems ──────────────────────────────────────────────────────────
const problems = [
  {
    id: 1,
    title: 'Sum of List',
    difficulty: 'easy',
    description: 'เขียนฟังก์ชัน <code>sum_list(lst)</code> ที่รับ List ของตัวเลขและคืนค่าผลรวมของสมาชิกทั้งหมด',
    examples: [
      { input: '[1, 2, 3, 4, 5]', output: '15' },
      { input: '[10, -3, 7]', output: '14' }
    ],
    starter: `def sum_list(lst):
    # เขียน code ของคุณที่นี่
    pass

# ทดสอบ
print(sum_list([1, 2, 3, 4, 5]))   # ควรได้ 15
print(sum_list([10, -3, 7]))        # ควรได้ 14`,
    tests: [
      { input: [[1,2,3,4,5]], expected: 15 },
      { input: [[10,-3,7]], expected: 14 },
      { input: [[-5,-3,-1]], expected: -9 },
      { input: [[0,0,0]], expected: 0 },
      { input: [[100]], expected: 100 }
    ],
    checker: `
def _c1(fn):
    _t=[([1,2,3,4,5],15),([10,-3,7],14),([-5,-3,-1],-9),([0,0,0],0),([100],100)]
    for i,e in _t:
        g=fn(list(i))
        if g!=e: return False,f"sum_list({i}) ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p1,_m1=_c1(sum_list)
print(f"{'✅ PASS' if _p1 else '❌ FAIL'}: {_m1}")
`
  },
  {
    id: 2,
    title: 'Reverse List',
    difficulty: 'easy',
    description: 'เขียนฟังก์ชัน <code>reverse_list(lst)</code> ที่คืนค่า List ที่กลับด้านแล้ว <strong>โดยไม่ใช้ .reverse() หรือ [::-1]</strong>',
    examples: [
      { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: '["a", "b", "c"]', output: '["c", "b", "a"]' }
    ],
    starter: `def reverse_list(lst):
    # เขียน code โดยไม่ใช้ .reverse() หรือ [::-1]
    pass

print(reverse_list([1, 2, 3, 4, 5]))  # [5, 4, 3, 2, 1]
print(reverse_list(["a", "b", "c"]))  # ['c', 'b', 'a']`,
    tests: [
      { input: [[1,2,3,4,5]], expected: [5,4,3,2,1] },
      { input: [['a','b','c']], expected: ['c','b','a'] },
      { input: [[42]], expected: [42] },
      { input: [[]], expected: [] }
    ],
    checker: `
def _check_reverse(submit):
    tests = [([1,2,3,4,5],[5,4,3,2,1]),(['a','b','c'],['c','b','a']),([42],[42]),([],[])]
    for inp, exp in tests:
        got = submit(list(inp))
        if got != exp:
            return False, f"reverse_list({inp}) ได้ {got}, ควรได้ {exp}"
    return True, "ผ่านทุก test case!"
_r2, _m2 = _check_reverse(reverse_list)
print(f"{'✅ PASS' if _r2 else '❌ FAIL'}: {_m2}")
`
  },
  {
    id: 3,
    title: 'Filter Even Numbers',
    difficulty: 'easy',
    description: 'เขียนฟังก์ชัน <code>filter_evens(lst)</code> ที่รับ List ตัวเลขและคืน List ที่มีเฉพาะ <strong>เลขคู่</strong> โดยใช้ List Comprehension',
    examples: [
      { input: '[1, 2, 3, 4, 5, 6]', output: '[2, 4, 6]' },
      { input: '[11, 22, 33, 44]', output: '[22, 44]' }
    ],
    starter: `def filter_evens(lst):
    # ใช้ List Comprehension
    pass

print(filter_evens([1, 2, 3, 4, 5, 6]))  # [2, 4, 6]
print(filter_evens([11, 22, 33, 44]))      # [22, 44]`,
    tests: [
      { input: [[1,2,3,4,5,6]], expected: [2,4,6] },
      { input: [[11,22,33,44]], expected: [22,44] },
      { input: [[1,3,5,7]], expected: [] },
      { input: [[0,2,4]], expected: [0,2,4] }
    ],
    checker: `
def _c3(fn):
    _t=[([1,2,3,4,5,6],[2,4,6]),([11,22,33,44],[22,44]),([1,3,5,7],[]),([0,2,4],[0,2,4])]
    for i,e in _t:
        g=fn(list(i))
        if g!=e: return False,f"filter_evens({i}) ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p3,_m3=_c3(filter_evens)
print(f"{'✅ PASS' if _p3 else '❌ FAIL'}: {_m3}")
`
  },
  {
    id: 4,
    title: 'Max in Matrix',
    difficulty: 'medium',
    description: 'เขียนฟังก์ชัน <code>max_in_matrix(matrix)</code> ที่รับ 2D List และคืนค่า <strong>จำนวนมากที่สุด</strong> ใน Matrix',
    examples: [
      { input: '[[1,5,3],[7,2,9],[4,6,8]]', output: '9' },
      { input: '[[100]]', output: '100' }
    ],
    starter: `def max_in_matrix(matrix):
    # เขียน code ของคุณที่นี่
    pass

print(max_in_matrix([[1,5,3],[7,2,9],[4,6,8]]))  # 9
print(max_in_matrix([[100]]))                       # 100`,
    tests: [
      { input: [[[1,5,3],[7,2,9],[4,6,8]]], expected: 9 },
      { input: [[[100]]], expected: 100 },
      { input: [[[-1,-5,-3]]], expected: -1 },
      { input: [[[0,0,0],[0,99,0]]], expected: 99 }
    ],
    checker: `
def _c4(fn):
    _t=[([[1,5,3],[7,2,9],[4,6,8]],9),([[100]],100),([[-1,-5,-3]],-1),([[0,0,0],[0,99,0]],99)]
    for i,e in _t:
        g=fn(i)
        if g!=e: return False,f"max_in_matrix ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p4,_m4=_c4(max_in_matrix)
print(f"{'✅ PASS' if _p4 else '❌ FAIL'}: {_m4}")
`
  },
  {
    id: 5,
    title: 'Rotate List',
    difficulty: 'medium',
    description: 'เขียนฟังก์ชัน <code>rotate(lst, k)</code> ที่หมุน List ไปทางขวา k ตำแหน่ง โดยใช้ Slicing เท่านั้น',
    examples: [
      { input: '[1,2,3,4,5], k=2', output: '[4, 5, 1, 2, 3]' },
      { input: '[1,2,3], k=1', output: '[3, 1, 2]' }
    ],
    starter: `def rotate(lst, k):
    # ใช้ Slicing เท่านั้น!
    pass

print(rotate([1,2,3,4,5], 2))  # [4, 5, 1, 2, 3]
print(rotate([1,2,3], 1))       # [3, 1, 2]`,
    tests: [
      { input: [[1,2,3,4,5], 2], expected: [4,5,1,2,3] },
      { input: [[1,2,3], 1], expected: [3,1,2] },
      { input: [[1,2,3,4,5], 0], expected: [1,2,3,4,5] },
      { input: [[1,2,3], 3], expected: [1,2,3] }
    ],
    checker: `
def _c5(fn):
    _t=[([1,2,3,4,5],2,[4,5,1,2,3]),([1,2,3],1,[3,1,2]),([1,2,3,4,5],0,[1,2,3,4,5]),([1,2,3],3,[1,2,3])]
    for l,k,e in _t:
        g=fn(list(l),k)
        if g!=e: return False,f"rotate({l},{k}) ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p5,_m5=_c5(rotate)
print(f"{'✅ PASS' if _p5 else '❌ FAIL'}: {_m5}")
`
  },
  {
    id: 6,
    title: 'Flatten Matrix',
    difficulty: 'medium',
    description: 'เขียนฟังก์ชัน <code>flatten(matrix)</code> ที่แปลง 2D List ให้เป็น 1D List โดยใช้ List Comprehension',
    examples: [
      { input: '[[1,2],[3,4],[5,6]]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: '[[10,20,30]]', output: '[10, 20, 30]' }
    ],
    starter: `def flatten(matrix):
    # ใช้ List Comprehension
    pass

print(flatten([[1,2],[3,4],[5,6]]))  # [1, 2, 3, 4, 5, 6]
print(flatten([[10,20,30]]))         # [10, 20, 30]`,
    tests: [
      { input: [[[1,2],[3,4],[5,6]]], expected: [1,2,3,4,5,6] },
      { input: [[[10,20,30]]], expected: [10,20,30] },
      { input: [[[1],[2],[3]]], expected: [1,2,3] }
    ],
    checker: `
def _c6(fn):
    _t=[([[1,2],[3,4],[5,6]],[1,2,3,4,5,6]),([[10,20,30]],[10,20,30]),([[1],[2],[3]],[1,2,3])]
    for i,e in _t:
        g=fn(i)
        if g!=e: return False,f"flatten ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p6,_m6=_c6(flatten)
print(f"{'✅ PASS' if _p6 else '❌ FAIL'}: {_m6}")
`
  },
  {
    id: 7,
    title: 'Count Duplicates',
    difficulty: 'medium',
    description: 'เขียนฟังก์ชัน <code>count_duplicates(lst)</code> ที่คืนจำนวน element ที่ปรากฏมากกว่า 1 ครั้งใน List',
    examples: [
      { input: '[1, 2, 3, 2, 4, 3, 3]', output: '2' },
      { input: '[5, 5, 5, 5]', output: '1' }
    ],
    starter: `def count_duplicates(lst):
    # คืนจำนวน unique element ที่ซ้ำ (ไม่ใช่จำนวนครั้งที่ซ้ำ)
    pass

print(count_duplicates([1, 2, 3, 2, 4, 3, 3]))  # 2
print(count_duplicates([5, 5, 5, 5]))             # 1
print(count_duplicates([1, 2, 3]))                # 0`,
    tests: [
      { input: [[1,2,3,2,4,3,3]], expected: 2 },
      { input: [[5,5,5,5]], expected: 1 },
      { input: [[1,2,3]], expected: 0 },
      { input: [[1,1,2,2,3,3]], expected: 3 }
    ],
    checker: `
def _c7(fn):
    _t=[([1,2,3,2,4,3,3],2),([5,5,5,5],1),([1,2,3],0),([1,1,2,2,3,3],3)]
    for i,e in _t:
        g=fn(list(i))
        if g!=e: return False,f"count_duplicates({i}) ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p7,_m7=_c7(count_duplicates)
print(f"{'✅ PASS' if _p7 else '❌ FAIL'}: {_m7}")
`
  },
  {
    id: 8,
    title: 'Diagonal Sum',
    difficulty: 'hard',
    description: 'เขียนฟังก์ชัน <code>diagonal_sum(matrix)</code> ที่คืนผลรวมของ <strong>แนวทแยงหลัก</strong> (main diagonal) ของ Matrix N×N',
    examples: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '15' },
      { input: '[[5]]', output: '5' }
    ],
    starter: `def diagonal_sum(matrix):
    # matrix[i][i] คือ diagonal หลัก
    pass

print(diagonal_sum([[1,2,3],[4,5,6],[7,8,9]]))  # 1+5+9 = 15
print(diagonal_sum([[5]]))                        # 5`,
    tests: [
      { input: [[[1,2,3],[4,5,6],[7,8,9]]], expected: 15 },
      { input: [[[5]]], expected: 5 },
      { input: [[[1,0],[0,1]]], expected: 2 },
      { input: [[[2,3,4],[5,6,7],[8,9,10]]], expected: 18 }
    ],
    checker: `
def _c8(fn):
    _t=[([[1,2,3],[4,5,6],[7,8,9]],15),([[5]],5),([[1,0],[0,1]],2),([[2,3,4],[5,6,7],[8,9,10]],18)]
    for i,e in _t:
        g=fn(i)
        if g!=e: return False,f"diagonal_sum ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p8,_m8=_c8(diagonal_sum)
print(f"{'✅ PASS' if _p8 else '❌ FAIL'}: {_m8}")
`
  },
  {
    id: 9,
    title: 'Spiral Order',
    difficulty: 'hard',
    description: 'เขียนฟังก์ชัน <code>spiral_order(matrix)</code> ที่อ่านค่าจาก Matrix ตามทิศทางเกลียว (ขวา → ลง → ซ้าย → ขึ้น)',
    examples: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
      { input: '[[1,2],[3,4]]', output: '[1,2,4,3]' }
    ],
    starter: `def spiral_order(matrix):
    result = []
    if not matrix:
        return result
    top, bottom = 0, len(matrix)-1
    left, right = 0, len(matrix[0])-1
    while top <= bottom and left <= right:
        # ขวา
        for c in range(left, right+1):
            result.append(matrix[top][c])
        top += 1
        # ลง
        for r in range(top, bottom+1):
            result.append(matrix[r][right])
        right -= 1
        # ซ้าย
        if top <= bottom:
            for c in range(right, left-1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        # ขึ้น
        if left <= right:
            for r in range(bottom, top-1, -1):
                result.append(matrix[r][left])
            left += 1
    return result

print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))
print(spiral_order([[1,2],[3,4]]))`,
    tests: [
      { input: [[[1,2,3],[4,5,6],[7,8,9]]], expected: [1,2,3,6,9,8,7,4,5] },
      { input: [[[1,2],[3,4]]], expected: [1,2,4,3] },
      { input: [[[1]]], expected: [1] }
    ],
    checker: `
def _c9(fn):
    _t=[([[1,2,3],[4,5,6],[7,8,9]],[1,2,3,6,9,8,7,4,5]),([[1,2],[3,4]],[1,2,4,3]),([[1]],[1])]
    for i,e in _t:
        g=fn(i)
        if g!=e: return False,f"spiral_order ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p9,_m9=_c9(spiral_order)
print(f"{'✅ PASS' if _p9 else '❌ FAIL'}: {_m9}")
`
  },
  {
    id: 10,
    title: 'Bonus Score LC',
    difficulty: 'hard',
    description: 'เขียนฟังก์ชัน <code>bonus_scores(scores)</code> ที่ใช้ List Comprehension: ถ้าคะแนน ≥90 ให้บวก 5, ถ้า ≥70 ให้บวก 2, ถ้าต่ำกว่า 70 ให้คงเดิม',
    examples: [
      { input: '[95, 89, 100, 70, 60]', output: '[100, 89, 105, 72, 60]' },
      { input: '[50, 90]', output: '[50, 95]' }
    ],
    starter: `def bonus_scores(scores):
    # ใช้ List Comprehension + If-Else ซ้อนกัน
    pass

print(bonus_scores([95, 89, 100, 70, 60]))  # [100, 89, 105, 72, 60]
print(bonus_scores([50, 90]))               # [50, 95]`,
    tests: [
      { input: [[95,89,100,70,60]], expected: [100,89,105,72,60] },
      { input: [[50,90]], expected: [50,95] },
      { input: [[100,100]], expected: [105,105] },
      { input: [[69,70,71]], expected: [69,72,73] }
    ],
    checker: `
def _c10(fn):
    _t=[([95,89,100,70,60],[100,89,105,72,60]),([50,90],[50,95]),([100,100],[105,105]),([69,70,71],[69,72,73])]
    for i,e in _t:
        g=fn(list(i))
        if g!=e: return False,f"bonus_scores({i}) ได้ {g} ควรได้ {e}"
    return True,"ผ่านทุก test case!"
_p10,_m10=_c10(bonus_scores)
print(f"{'✅ PASS' if _p10 else '❌ FAIL'}: {_m10}")
`
  }
];

// ── BigO Data ──────────────────────────────────────────────────────────────
const bigoData = [
  {
    notation: 'O(1)',
    name: 'Constant',
    rating: 'best',
    ratingLabel: 'Excellent',
    color: '#39ff14',
    desc: 'เวลาคงที่เสมอ ไม่ว่า input จะใหญ่แค่ไหน — เร็วที่สุด',
    example: 'list[i], append(), len(), dict lookup',
    fn: n => 1,
    bars: [5, 5, 5, 5, 5, 5, 5],
    accent: '#39ff14'
  },
  {
    notation: 'O(log n)',
    name: 'Logarithmic',
    rating: 'good',
    ratingLabel: 'Great',
    color: '#a0f000',
    desc: 'เวลาเพิ่มขึ้นช้ามาก เมื่อ input เพิ่มเป็น 2 เท่า เวลาเพิ่มแค่ 1 ขั้น',
    example: 'Binary Search, Balanced BST lookup',
    fn: n => Math.log2(n + 1),
    bars: [2, 3, 4, 4, 5, 5, 6],
    accent: '#a0f000'
  },
  {
    notation: 'O(n)',
    name: 'Linear',
    rating: 'fair',
    ratingLabel: 'OK',
    color: '#ffe600',
    desc: 'เวลาเพิ่มตามขนาด input โดยตรง — ยอมรับได้สำหรับงานทั่วไป',
    example: 'x in list, remove(), Linear search',
    fn: n => n,
    bars: [2, 5, 8, 11, 14, 17, 20],
    accent: '#ffe600'
  },
  {
    notation: 'O(n log n)',
    name: 'Linearithmic',
    rating: 'fair',
    ratingLabel: 'Acceptable',
    color: '#ff9500',
    desc: 'ดีกว่า O(n²) มาก ใช้ใน sorting algorithms ทั่วไป',
    example: 'sorted(), list.sort(), Merge Sort',
    fn: n => n * Math.log2(n + 1),
    bars: [2, 6, 11, 16, 22, 28, 34],
    accent: '#ff9500'
  },
  {
    notation: 'O(n²)',
    name: 'Quadratic',
    rating: 'bad',
    ratingLabel: 'Slow',
    color: '#ff6b35',
    desc: 'input 2 เท่า → เวลา 4 เท่า! หลีกเลี่ยงถ้าเป็นไปได้',
    example: 'Bubble Sort, Nested loops over n',
    fn: n => n * n,
    bars: [2, 8, 18, 32, 50, 72, 98],
    accent: '#ff6b35'
  },
  {
    notation: 'O(2ⁿ)',
    name: 'Exponential',
    rating: 'terrible',
    ratingLabel: 'Terrible',
    color: '#ff2d78',
    desc: 'input +1 → เวลา 2 เท่า! ใช้ได้เฉพาะ n ขนาดเล็กมาก',
    example: 'Fibonacci naive, Power set',
    fn: n => Math.pow(2, n),
    bars: [2, 4, 8, 16, 32, 64, 128],
    accent: '#ff2d78'
  }
];

// ── Initialize App ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupLearnPage();
  setupQuizPage();
  setupBigoPage();
  initPyodide();
  showToast('🐍 Loading Python runtime...', 'info');
});

// ── Navigation ──────────────────────────────────────────────────────────────
function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      switchPage(page);
    });
  });
}

function switchPage(pageId) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`[data-page="${pageId}"]`);
  const page = document.getElementById(`${pageId}-page`);
  if (btn) btn.classList.add('active');
  if (page) page.classList.add('active');
  if (pageId === 'bigo') renderBigoChart();
}

// ── Pyodide Setup ───────────────────────────────────────────────────────────
async function initPyodide() {
  try {
    const overlay = document.getElementById('pyodide-overlay');
    state.pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/",
    });
    // Pre-import io and sys once
    state.pyodide.runPython("import sys, io");
    state.pyodideReady = true;
    if (overlay) overlay.classList.add('hidden');
    showToast('✅ Python ready!', 'success');
    enableEditorButtons();
  } catch (e) {
    console.error('Pyodide load error:', e);
    document.getElementById('pyodide-overlay')?.classList.add('hidden');
    showToast('⚠️ Python โหลดไม่สำเร็จ — ตรวจสอบ internet', 'error');
  }
}

function enableEditorButtons() {
  document.querySelectorAll('.btn-run, .btn-check').forEach(b => b.disabled = false);
}

async function runPython(code, outputId) {
  const output = document.getElementById(outputId);
  if (!output) return;

  if (!state.pyodideReady) {
    output.textContent = '⚠️ Python ยังโหลดอยู่ กรุณารอสักครู่...';
    output.className = 'output-body error';
    return;
  }

  output.className = 'output-body';
  output.innerHTML = '<div class="output-loading"><div class="spinner"></div>Running...</div>';

  // Small delay so spinner renders
  await new Promise(r => setTimeout(r, 10));

  try {
    // Capture stdout by redirecting sys.stdout to StringIO
    const captureSetup = [
      "import sys, io as _io",
      "_buf = _io.StringIO()",
      "_old_stdout = sys.stdout",
      "sys.stdout = _buf"
    ].join("\n");

    state.pyodide.runPython(captureSetup);

    try {
      state.pyodide.runPython(code);
    } finally {
      // Always restore stdout
      state.pyodide.runPython("sys.stdout = _old_stdout");
    }

    const result = state.pyodide.runPython("_buf.getvalue()");
    output.textContent = result || '(no output)';
    output.className = 'output-body';
  } catch (err) {
    // Make sure stdout is restored even on error
    try { state.pyodide.runPython("sys.stdout = _old_stdout"); } catch(_) {}
    output.textContent = `❌ Error:\n${err.message}`;
    output.className = 'output-body error';
  }
}

async function runAndCheck(code, checker, verdictId, testChipsId) {
  if (!state.pyodideReady) {
    showToast('⚠️ Python ยังโหลดอยู่', 'error');
    return;
  }

  const fullCode = code + '\n' + checker;
  const output = document.getElementById('quiz-output-body');
  const verdict = document.getElementById(verdictId);
  const chipsEl = document.getElementById(testChipsId);

  output.innerHTML = '<div class="output-loading"><div class="spinner"></div>Checking...</div>';
  verdict.className = 'verdict';
  if (chipsEl) chipsEl.innerHTML = '';

  await new Promise(r => setTimeout(r, 10));

  try {
    const captureSetup = [
      "import sys, io as _io",
      "_buf2 = _io.StringIO()",
      "_old_stdout2 = sys.stdout",
      "sys.stdout = _buf2"
    ].join("\n");

    state.pyodide.runPython(captureSetup);

    let runError = null;
    try {
      state.pyodide.runPython(fullCode);
    } catch (e) {
      runError = e;
    } finally {
      state.pyodide.runPython("sys.stdout = _old_stdout2");
    }

    if (runError) throw runError;

    const result = state.pyodide.runPython("_buf2.getvalue()");
    output.textContent = result || '';

    const passed = result.includes('✅ PASS');
    verdict.className = `verdict show ${passed ? 'pass' : 'fail'}`;
    verdict.innerHTML = passed
      ? '<span class="verdict-icon">🎉</span> ผ่านทุก test case!'
      : `<span class="verdict-icon">❌</span> ${(result || 'ไม่ผ่าน').replace(/\n/g,' ')}`;

    if (passed && !state.solvedProblems.has(state.currentProblem)) {
      state.solvedProblems.add(state.currentProblem);
      const pts = getDifficultyPoints(problems[state.currentProblem].difficulty);
      state.score += pts;
      updateScore();
      markSolved(state.currentProblem);
      updateProgress();
      showToast(`🏆 ผ่านแล้ว! +${pts} pts`, 'success');
    }
  } catch (err) {
    try { state.pyodide.runPython("sys.stdout = _old_stdout2"); } catch(_) {}
    output.textContent = `❌ Error:\n${err.message}`;
    output.className = 'output-body error';
    verdict.className = 'verdict show fail';
    verdict.innerHTML = '<span class="verdict-icon">💥</span> Runtime Error — ตรวจสอบ code อีกครั้ง';
  }
}

function getDifficultyPoints(diff) {
  return { easy: 10, medium: 20, hard: 35 }[diff] || 10;
}

// ── Learn Page ──────────────────────────────────────────────────────────────
function setupLearnPage() {
  const sidebar = document.getElementById('topic-list');
  const theory = document.getElementById('theory-content');

  topics.forEach((topic, i) => {
    const item = document.createElement('div');
    item.className = 'topic-item' + (i === 0 ? ' active' : '');
    item.dataset.index = i;
    item.innerHTML = `
      <div class="topic-icon" style="background:${topic.color}20;color:${topic.color}">${topic.icon}</div>
      <div class="topic-info">
        <div class="topic-name">${topic.name}</div>
      </div>
      <span class="topic-badge">${topic.badge}</span>`;
    item.addEventListener('click', () => selectTopic(i));
    sidebar.appendChild(item);
  });

  // Load first topic
  loadTopicContent(0);

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#learn-page .tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  // Run button for learn editor
  document.getElementById('run-learn-btn')?.addEventListener('click', () => {
    if (!state.learnEditor) return;
    const code = state.learnEditor.getValue();
    runPython(code, 'learn-output-body');
  });

  // Reset button
  document.getElementById('reset-learn-btn')?.addEventListener('click', () => {
    if (!state.learnEditor) return;
    state.learnEditor.setValue(topics[state.currentTopic].starter);
  });
}

function selectTopic(index) {
  state.currentTopic = index;
  document.querySelectorAll('.topic-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  loadTopicContent(index);

  // Switch to theory tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#learn-page .tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="theory-tab"]')?.classList.add('active');
  document.getElementById('theory-tab')?.classList.add('active');
}

function loadTopicContent(index) {
  const topic = topics[index];
  document.getElementById('theory-content').innerHTML = topic.content;

  // Add inline code styling
  document.querySelectorAll('.inline-code').forEach(el => {
    el.style.cssText = 'background:#111320;border:1px solid #1e2240;border-radius:3px;padding:1px 5px;font-family:var(--font-mono);font-size:0.82em;color:#00f5ff';
  });

  // Update editor if ready
  if (state.learnEditor) {
    state.learnEditor.setValue(topic.starter);
  }
}

// Monaco Editor init for Learn
function initLearnMonaco() {
  if (state.learnEditor) return;
  require(['vs/editor/editor.main'], () => {
    // Define custom theme first
    monaco.editor.defineTheme('py-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
        { token: 'string', foreground: 'c3e88d' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#0d0f1a',
        'editor.foreground': '#eeffff',
        'editor.lineHighlightBackground': '#161829',
        'editorLineNumber.foreground': '#2a3060',
        'editorLineNumber.activeForeground': '#00f5ff',
        'editorCursor.foreground': '#00f5ff',
        'editor.selectionBackground': '#1e2a4a',
        'editorIndentGuide.background': '#1e2240',
      }
    });
    monaco.editor.setTheme('py-dark');

    state.learnEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
      value: topics[state.currentTopic].starter,
      language: 'python',
      theme: 'py-dark',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      padding: { top: 12, bottom: 12 },
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
    });
  });
}

// ── Quiz Page ───────────────────────────────────────────────────────────────
function setupQuizPage() {
  const problemList = document.getElementById('problem-list');

  problems.forEach((prob, i) => {
    const item = document.createElement('div');
    item.className = 'problem-item' + (i === 0 ? ' active' : '');
    item.dataset.index = i;
    item.innerHTML = `
      <div class="problem-num">${prob.id}</div>
      <div class="problem-title-small">${prob.title}</div>
      <div class="difficulty-dot diff-${prob.difficulty}"></div>`;
    item.addEventListener('click', () => selectProblem(i));
    problemList.appendChild(item);
  });

  loadProblem(0);

  document.getElementById('run-quiz-btn')?.addEventListener('click', () => {
    if (!state.quizEditor) return;
    runPython(state.quizEditor.getValue(), 'quiz-output-body');
  });

  document.getElementById('check-quiz-btn')?.addEventListener('click', () => {
    if (!state.quizEditor) return;
    const prob = problems[state.currentProblem];
    runAndCheck(state.quizEditor.getValue(), prob.checker, 'quiz-verdict', 'test-chips');
  });

  document.getElementById('reset-quiz-btn')?.addEventListener('click', () => {
    if (!state.quizEditor) return;
    state.quizEditor.setValue(problems[state.currentProblem].starter);
  });
}

function selectProblem(index) {
  state.currentProblem = index;
  document.querySelectorAll('.problem-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  loadProblem(index);
}

function loadProblem(index) {
  const prob = problems[index];

  document.getElementById('problem-title').textContent = prob.title;
  document.getElementById('problem-description').innerHTML = prob.description;
  document.getElementById('problem-difficulty').className = `difficulty-badge diff-badge-${prob.difficulty}`;
  document.getElementById('problem-difficulty').textContent = prob.difficulty.toUpperCase();

  // IO examples
  const ioContainer = document.getElementById('io-examples');
  ioContainer.innerHTML = prob.examples.map(ex => `
    <div class="io-box">
      <div class="io-label">Input</div>
      <div class="io-value">${ex.input}</div>
    </div>
    <div class="io-box">
      <div class="io-label">Output</div>
      <div class="io-value">${ex.output}</div>
    </div>`).join('');

  if (state.quizEditor) {
    state.quizEditor.setValue(prob.starter);
    document.getElementById('quiz-output-body').textContent = '';
    document.getElementById('quiz-verdict').className = 'verdict';
  }
}

function markSolved(index) {
  const items = document.querySelectorAll('.problem-item');
  if (items[index]) {
    items[index].classList.add('solved');
    items[index].querySelector('.problem-num').textContent = '✓';
  }
}

function initQuizMonaco() {
  if (state.quizEditor) return;
  require(['vs/editor/editor.main'], () => {
    // Define theme if not already defined (in case quiz loads before learn)
    try {
      monaco.editor.defineTheme('py-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
          { token: 'string', foreground: 'c3e88d' },
          { token: 'number', foreground: 'f78c6c' },
          { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#0d0f1a',
          'editor.foreground': '#eeffff',
          'editor.lineHighlightBackground': '#161829',
          'editorLineNumber.foreground': '#2a3060',
          'editorLineNumber.activeForeground': '#00f5ff',
          'editorCursor.foreground': '#00f5ff',
          'editor.selectionBackground': '#1e2a4a',
        }
      });
    } catch(_) {}
    monaco.editor.setTheme('py-dark');

    state.quizEditor = monaco.editor.create(document.getElementById('quiz-monaco-editor'), {
      value: problems[state.currentProblem].starter,
      language: 'python',
      theme: 'py-dark',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      padding: { top: 10, bottom: 10 },
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
    });
  });
}

// ── BigO Page ───────────────────────────────────────────────────────────────
function setupBigoPage() {
  const grid = document.getElementById('bigo-cards');

  bigoData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bigo-card';
    card.style.setProperty('--card-accent', item.color);

    const barMax = Math.max(...item.bars);
    const barsHtml = item.bars.map(v => {
      const h = Math.round((v / barMax) * 44) + 4;
      return `<div class="mini-bar" style="height:${h}px;background:${item.color};border-radius:2px 2px 0 0"></div>`;
    }).join('');

    card.innerHTML = `
      <div class="bigo-card-header">
        <div>
          <div class="bigo-notation">${item.notation}</div>
          <div class="bigo-name">${item.name}</div>
        </div>
        <div class="bigo-rating rating-${item.rating}">${item.ratingLabel}</div>
      </div>
      <p class="bigo-desc">${item.desc}</p>
      <div class="bigo-example">${item.example}</div>
      <div class="bigo-mini-bars">${barsHtml}</div>`;
    grid.appendChild(card);
  });

  // Viz toggles
  const vizControls = document.getElementById('viz-controls');
  bigoData.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'viz-toggle active';
    btn.textContent = item.notation;
    btn.style.setProperty('--toggle-color', item.color);
    btn.dataset.fn = item.notation;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) state.bigoToggles.add(item.notation);
      else state.bigoToggles.delete(item.notation);
      renderBigoChart();
    });
    vizControls.appendChild(btn);
  });

  // N slider
  document.getElementById('n-slider')?.addEventListener('input', e => {
    state.nValue = +e.target.value;
    document.getElementById('n-value').textContent = state.nValue;
    renderBigoChart();
  });
}

function renderBigoChart() {
  const canvas = document.getElementById('bigo-main-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight || 320;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#040508';
  ctx.fillRect(0, 0, W, H);

  const pad = { top: 20, right: 20, bottom: 40, left: 55 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bottom;
  const N = state.nValue;
  const steps = 100;

  // Draw grid
  ctx.strokeStyle = 'rgba(30,34,64,0.8)';
  ctx.lineWidth = 1;
  for (let g = 0; g <= 5; g++) {
    const y = pad.top + (ph / 5) * g;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + pw, y); ctx.stroke();
  }
  for (let g = 0; g <= 5; g++) {
    const x = pad.left + (pw / 5) * g;
    ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + ph); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(0,245,255,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + ph);
  ctx.moveTo(pad.left, pad.top + ph); ctx.lineTo(pad.left + pw, pad.top + ph);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#4a5380';
  ctx.font = `11px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('n', pad.left + pw / 2, H - 4);
  ctx.save(); ctx.translate(12, pad.top + ph / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('T(n)', 0, 0); ctx.restore();

  // Compute y max across all active fns
  const activeFns = bigoData.filter(d => state.bigoToggles.has(d.notation));
  if (activeFns.length === 0) return;

  let yMax = 0;
  activeFns.forEach(d => {
    for (let s = 0; s <= steps; s++) {
      const xv = (s / steps) * N;
      const yv = d.fn(xv);
      if (isFinite(yv) && yv > yMax) yMax = yv;
    }
  });
  if (yMax === 0) yMax = 1;

  // Y axis labels
  ctx.fillStyle = '#4a5380';
  ctx.font = `10px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'right';
  for (let g = 0; g <= 5; g++) {
    const v = Math.round((yMax / 5) * (5 - g));
    ctx.fillText(v, pad.left - 6, pad.top + (ph / 5) * g + 4);
  }

  // X axis labels
  ctx.textAlign = 'center';
  for (let g = 0; g <= 5; g++) {
    const v = Math.round((N / 5) * g);
    ctx.fillText(v, pad.left + (pw / 5) * g, pad.top + ph + 16);
  }

  // Draw each active fn
  activeFns.forEach(d => {
    ctx.save();
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let s = 0; s <= steps; s++) {
      const xv = (s / steps) * N;
      const yv = d.fn(xv);
      const px = pad.left + (xv / N) * pw;
      const py = pad.top + ph - Math.min((yv / yMax), 1) * ph;
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Label at end
    const lastX = (N / N) * N;
    const lastY = d.fn(lastX);
    const lpx = pad.left + pw - 2;
    const lpy = pad.top + ph - Math.min((lastY / yMax), 1) * ph;
    ctx.fillStyle = d.color;
    ctx.font = `bold 10px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(d.notation, lpx - 4, Math.max(lpy - 4, pad.top + 12));
  });
}

// ── Score ───────────────────────────────────────────────────────────────────
function updateScore() {
  const el = document.getElementById('score-display');
  if (el) el.textContent = `${state.score} pts · ${state.solvedProblems.size}/${problems.length}`;
  updateProgress();
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = `${(state.solvedProblems.size / problems.length) * 100}%`;
}

// ── Toast ───────────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ── Monaco Loader ───────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
  script.onload = () => {
    require.config({
      paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
    });

    // Hook Learn tab — init Monaco when Practice tab is clicked
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'practice-tab') {
          // Small delay so DOM updates first
          setTimeout(initLearnMonaco, 50);
        }
      });
    });

    // Hook Quiz nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.page === 'quiz') {
          setTimeout(initQuizMonaco, 50);
        }
        if (btn.dataset.page === 'bigo') {
          setTimeout(renderBigoChart, 50);
        }
      });
    });
  };
  document.head.appendChild(script);

  // Resize redraws Big-O chart
  window.addEventListener('resize', () => {
    if (document.getElementById('bigo-page')?.classList.contains('active')) {
      renderBigoChart();
    }
  });
});
