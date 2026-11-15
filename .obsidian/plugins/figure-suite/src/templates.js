/*
 * Figure Suite — starter templates, one per family of CLRS figures.
 */

const TEMPLATES = [
  {
    group: 'Arrays & tables',
    name: 'Array with pointers (partition)',
    source: `array A
  2 8 7 1 3 5 6 4
  shade: 1..3 lightblue
  shade: 4..6 tan
  ptr: p=1 i=3 j=6 r=8
  span: 1..3 {\\le x} below`,
  },
  {
    group: 'Arrays & tables',
    name: 'Insertion sort step',
    source: `array A
  5 2 4 6 1 3
  shade: 2 black
  arc: 2 -> 1 below
  arc: 1 -> 2 above`,
  },
  {
    group: 'Arrays & tables',
    name: 'Counting sort (several arrays)',
    source: `array A
  2 5 3 0 2 3 0 3
array C start=0
  2 0 2 3 0 1
array B
  _ _ _ _ _ _ 3 _
  shade: 7`,
  },
  {
    group: 'Arrays & tables',
    name: 'Stack / queue',
    source: `array Q
  _ _ _ _ _ 15 6 9 8 4 _ _
  shade: 6..10
  ptr: head=6 tail=11 below`,
  },
  {
    group: 'Arrays & tables',
    name: 'DP table (LCS)',
    source: `table c start=0
  cols: _ j 0 1 2 3
  rows: i 0 1 2
  _ y_j B D C
  0 0 0 0 0
  0 {\\uparrow\\,0} {\\nwarrow\\,1} {\\leftarrow\\,1}
  shade: (2,4)`,
  },
  {
    group: 'Arrays & tables',
    name: 'Matrix',
    source: `table "$A =$" brackets
  1 2 3
  4 5 6
  7 8 9`,
  },
  {
    group: 'Arrays & tables',
    name: 'Binary counter',
    source: `table grid=rows
  cols: "\\text{Counter value}" A[3] A[2] A[1] A[0] "\\text{Total cost}"
  0 0 0 0 0 0
  1 0 0 0 1 1
  2 0 0 1 0 3
  3 0 0 1 1 4
  shade: (2,4..5) (3,5)`,
  },
  {
    group: 'Trees',
    name: 'Binary search tree',
    source: `tree
  15
    6
      3
        2
        4
      7
        _
        13
          9
          _
    18
      17
      20`,
  },
  {
    group: 'Trees',
    name: 'Heap: tree + array',
    source: `panel (a)
tree
  16 above=1
    14 above=2
      8 left=4
        2
        4
      7
        1
        _
    10 above=3
      9
      3
panel (b)
array A
  16 14 10 8 7 9 3 2 4 1
  shade: 2`,
  },
  {
    group: 'Trees',
    name: 'Red-black tree',
    source: `tree
  26 black
    17 red
      14 black
        nil
        nil
      21 black
        nil
        nil
    41 black
      30 red
        nil
        nil
      47 black
        nil
        nil`,
  },
  {
    group: 'Trees',
    name: 'Rotation (subtree triangles)',
    source: `tree
  x
    "α" tri
    y
      "β" tri
      "γ" tri
arrow "\\textsc{Left-Rotate}$(T, x)$"
tree
  y
    x
      "α" tri
      "β" tri
    "γ" tri`,
  },
  {
    group: 'Trees',
    name: 'B-tree',
    source: `tree
  [M]
    [D H]
      [B C]
      [F G]
      [J K L]
    [Q T X]
      [N P]
      [R S]
      [V W]
      [Y Z]`,
  },
  {
    group: 'Trees',
    name: 'Recursion tree',
    source: `tree shape=none
  "cn^2"
    "c(n/4)^2"
      "T(n/16)"
      "T(n/16)"
    "c(n/4)^2"
      "T(n/16)"
      "T(n/16)"
  level: 0 cn^2
  level: 1 \\frac{2}{16}cn^2
  level: 2 \\vdots`,
  },
  {
    group: 'Trees',
    name: 'Huffman tree',
    source: `tree
  100 box
    "a:45" box edge=0
    55 box edge=1
      25 box edge=0
        "c:12" box edge=0
        "b:13" box edge=1
      30 box edge=1
        14 box edge=0
          "f:5" box edge=0
          "e:9" box edge=1
        "d:16" box edge=1`,
  },
  {
    group: 'Trees',
    name: 'Disjoint-set forest',
    source: `tree arrows=up
  c loop
    h
    e
      b
  f loop
    d
    g`,
  },
  {
    group: 'Graphs',
    name: 'Undirected graph',
    source: `graph
  1 (0,1)
  2 (1,1)
  3 (2,1)
  4 (2,0)
  5 (1,0)
  1 -- 2
  1 -- 5
  2 -- 5
  2 -- 4
  2 -- 3
  3 -- 4
  4 -- 5`,
  },
  {
    group: 'Graphs',
    name: 'BFS / DFS state',
    source: `graph
  r (0,1) "\\infty" above=r
  s (1,1) "0" gray above=s
  t (2,1) "\\infty" above=t
  u (3,1) "\\infty" above=u
  v (0,0) "\\infty" below=v
  w (1,0) "1" gray below=w
  x (2,0) "\\infty" below=x
  y (3,0) "\\infty" below=y
  r -- s
  s -- w thick
  r -- v
  w -- t
  w -- x
  t -- x
  t -- u
  x -- u
  x -- y
  u -- y`,
  },
  {
    group: 'Graphs',
    name: 'Weighted digraph (shortest paths)',
    source: `graph
  s (0,0) "0" gray below=s
  t (1,1) "\\infty" above=t
  x (2.4,1) "\\infty" above=x
  y (1,-1) "\\infty" below=y
  z (2.4,-1) "\\infty" below=z
  s -> t 10
  s -> y 5
  t -> x 1
  t -> y 2 bend=15
  y -> t 3 bend=15
  y -> x 9
  y -> z 2
  x -> z 4 bend=15
  z -> x 6 bend=15
  z -> s 7 bend=-40`,
  },
  {
    group: 'Graphs',
    name: 'Flow network',
    source: `graph
  s (0,0)
  v1 (1,1)
  v2 (1,-1)
  v3 (2.3,1)
  v4 (2.3,-1)
  t (3.3,0)
  s -> v1 11/16
  s -> v2 8/13
  v2 -> v1 1/4
  v1 -> v3 12/12
  v3 -> v2 4/9
  v2 -> v4 11/14
  v4 -> v3 7/7
  v3 -> t 15/20
  v4 -> t 4/4`,
  },
  {
    group: 'Graphs',
    name: 'DAG (auto layered)',
    source: `graph layout=layered
  undershorts -> pants
  undershorts -> shoes
  pants -> belt
  pants -> shoes
  shirt -> belt
  shirt -> tie
  tie -> jacket
  belt -> jacket
  socks -> shoes`,
  },
  {
    group: 'Graphs',
    name: 'Topological order (line)',
    source: `graph layout=line shape=ellipse
  socks
  undershorts
  pants
  shoes
  shirt
  belt
  undershorts -> pants
  undershorts -> shoes
  pants -> shoes
  pants -> belt
  shirt -> belt
  socks -> shoes`,
  },
  {
    group: 'Graphs',
    name: 'Strongly connected components',
    source: `graph
  a (0,1)
  b (1,1)
  c (2,1)
  d (3,1)
  e (0,0)
  f (1,0)
  g (2,0)
  h (3,0)
  group: a b e
  group: c d
  group: f g
  group: h
  a -> b
  b -> e
  e -> a
  b -> f
  e -> f
  b -> c
  c -> d
  d -> c
  c -> g
  f -> g
  g -> f
  g -> h
  d -> h
  h -> h`,
  },
  {
    group: 'Graphs',
    name: 'Bipartite matching',
    source: `graph layout=layered dir=right
  rank: l1 l2 l3
  rank: r1 r2 r3
  l1 -- r1 thick
  l1 -- r2
  l2 -- r2 thick
  l3 -- r2
  l3 -- r3 thick`,
  },
  {
    group: 'Graphs',
    name: 'Finite automaton',
    source: `graph layout=circle
  0 start
  1
  2
  3 double
  0 -> 1 a
  1 -> 2 b
  2 -> 3 a
  1 -> 1 a
  3 -> 1 a bend=20
  2 -> 0 b bend=20
  0 -> 0 b`,
  },
  {
    group: 'Graphs',
    name: 'Points & segments (geometry)',
    source: `graph undirected
  p0 (0,0) point below=p_0
  p1 (2,0.3) point right=p_1
  p2 (2.6,1.6) point right=p_2
  p3 (1.2,2.2) point above=p_3
  p4 (-0.3,1.4) point left=p_4
  q (1.2,1) point right=q
  p0 -- p1 -- p2 -- p3 -- p4 -- p0`,
  },
  {
    group: 'Linked structures',
    name: 'Doubly linked list',
    source: `list L.head double
  9 16 4 1
  names: 2`,
  },
  {
    group: 'Linked structures',
    name: 'Singly linked list',
    source: `list L.head
  9 16 4 1`,
  },
  {
    group: 'Linked structures',
    name: 'Hash table with chaining',
    source: `chains T
  0:
  1: k1 k4
  2:
  3: k5 k2 k7
  4:
  5: k3
  6: k8 k6
  7:`,
  },
  {
    group: 'Linked structures',
    name: 'Adjacency list + matrix',
    source: `panel (a)
graph layout=circle
  1 -- 2
  1 -- 5
  2 -- 5
  2 -- 3
  2 -- 4
  3 -- 4
  4 -- 5
panel (b)
chains Adj start=1
  1: 2 5
  2: 1 5 3 4
  3: 2 4
  4: 2 5 3
  5: 4 1 2
panel (c)
table index
  0 1 0 0 1
  1 0 1 1 1
  0 1 0 1 0
  0 1 1 0 1
  1 1 0 1 0`,
  },
  {
    group: 'Layout',
    name: 'Before → after panels',
    source: `figure cols=3
panel (a)
array A
  5 2 4 6 1 3
  shade: 2
arrow "step"
panel (b)
array A
  2 5 4 6 1 3
  shade: 3`,
  },
];
