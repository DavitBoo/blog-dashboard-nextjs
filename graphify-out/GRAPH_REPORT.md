# Graph Report - blog-dashboard  (2026-08-30)

## Corpus Check
- 63 files · ~16,605 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 330 nodes · 648 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f532db6a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getAuthHeaders
- dependencies
- devDependencies
- api.ts
- compilerOptions
- MediaGalery.tsx
- RichTextEditor.tsx
- Post.ts
- fetchPosts
- comments/page.tsx
- ConfirmArticleDelete.tsx
- libros/edit/[id]/page.tsx
- DashboardSidebar.tsx
- .prettierrc.json
- app/layout.tsx
- eslint.config.mjs
- middleware.ts
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `getAuthHeaders()` - 46 edges
2. `assertOk()` - 21 edges
3. `compilerOptions` - 16 edges
4. `BackButton()` - 14 edges
5. `fetchLabels()` - 10 edges
6. `InfoText()` - 9 edges
7. `fetchPosts()` - 8 edges
8. `fetchProjectCategories()` - 8 edges
9. `scripts` - 7 edges
10. `VidaItemForm()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `IVidaItemListado`  [EXTRACTED]
  src/app/components/VidaItemList.tsx → src/interfaces/Vida.ts
- `Props` --references--> `IVidaLibro`  [EXTRACTED]
  src/app/components/VidaLibroForm.tsx → src/interfaces/Vida.ts
- `CommentsPage()` --calls--> `fetchAllComments()`  [EXTRACTED]
  src/app/dashboard/comments/page.tsx → src/utils/api.ts
- `ImageCardProps` --references--> `Image`  [EXTRACTED]
  src/app/dashboard/media/ImageCard.tsx → src/interfaces/Image.ts
- `AnalyticsPage()` --calls--> `fetchPosts()`  [EXTRACTED]
  src/app/dashboard/myAnalytics/page.tsx → src/utils/api.ts

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "getAuthHeaders"
Cohesion: 0.18
Nodes (19): BackButton(), page(), EditPost(), DisplayLabelsAdd(), NewPost(), IProjectCategory, ProjectCategoriesPage(), ILabel (+11 more)

### Community 1 - "dependencies"
Cohesion: 0.05
Nodes (37): lowlight, multer, next, dependencies, lowlight, multer, next, react (+29 more)

### Community 2 - "devDependencies"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, eslint-plugin-sonarjs, devDependencies, eslint, eslint-config-next (+25 more)

### Community 3 - "api.ts"
Cohesion: 0.10
Nodes (45): ConfirmVidaDelete(), Props, InfoText(), Props, AMBITOS, EnlaceRow, MediaRow, Props (+37 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 5 - "MediaGalery.tsx"
Cohesion: 0.13
Nodes (18): MediaPickerModal(), MediaPickerModalProps, Card(), CardProps, ImageCard(), ImageCardProps, ImageUpload(), ImageUploadProps (+10 more)

### Community 6 - "RichTextEditor.tsx"
Cohesion: 0.11
Nodes (19): CarouselComponent(), CarouselExtension, Commands, @tiptap/core, extensions, lowlight, RichTextEditorProps, RichTextEditor (+11 more)

### Community 7 - "Post.ts"
Cohesion: 0.39
Nodes (6): IComment, IPost, IUser, Role, ADMIN, USER

### Community 8 - "fetchPosts"
Cohesion: 0.15
Nodes (14): ConfirmProjectDelete(), Props, Project, ProjectList(), ProjectListProps, AnalyticsPage(), PostStat, DashboardHome() (+6 more)

### Community 9 - "comments/page.tsx"
Cohesion: 0.23
Nodes (8): Comment, CommentListProps, Comment, CommentsPage(), CommentManagement(), approveComment(), deleteComment(), fetchCommentsByPostId()

### Community 10 - "ConfirmArticleDelete.tsx"
Cohesion: 0.25
Nodes (8): ConfirmArticleDelete(), Props, Post, PostList(), PostListProps, PostManagement(), deletePost(), togglePublishPost()

### Community 11 - "libros/edit/[id]/page.tsx"
Cohesion: 0.33
Nodes (8): Props, VidaLibroForm(), EditLibroPage(), NewLibroPage(), IVidaLibro, createVidaLibro(), fetchVidaLibroById(), updateVidaLibro()

### Community 12 - "DashboardSidebar.tsx"
Cohesion: 0.33
Nodes (4): DashboardSidebar(), MenuItem, MenuItemWithChildren, MenuItemWithLink

### Community 13 - ".prettierrc.json"
Cohesion: 0.33
Nodes (5): printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 14 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 15 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): compat, __dirname, __filename

## Knowledge Gaps
- **111 isolated node(s):** `singleQuote`, `semi`, `trailingComma`, `printWidth`, `tabWidth` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `ILabel` connect `getAuthHeaders` to `Post.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `singleQuote`, `semi`, `trailingComma` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09774436090225563 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._