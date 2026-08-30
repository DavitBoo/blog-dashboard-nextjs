# Graph Report - blog-dashboard  (2026-08-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 329 nodes · 649 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ad0af73`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- dependencies
- devDependencies
- VidaItemForm.tsx
- compilerOptions
- MediaGalery.tsx
- RichTextEditor.tsx
- BackButton.tsx
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
7. `fetchProjectCategories()` - 8 edges
8. `fetchPosts()` - 8 edges
9. `IVidaLibro` - 7 edges
10. `ILabel` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `IVidaLibro`  [EXTRACTED]
  src/app/components/VidaLibroForm.tsx → src/interfaces/Vida.ts
- `Props` --references--> `IVidaItemListado`  [EXTRACTED]
  src/app/components/VidaItemList.tsx → src/interfaces/Vida.ts
- `ImageCardProps` --references--> `Image`  [EXTRACTED]
  src/app/dashboard/media/ImageCard.tsx → src/interfaces/Image.ts
- `ProjectCategoriesPage()` --calls--> `fetchProjectCategories()`  [EXTRACTED]
  src/app/dashboard/projectCategories/page.tsx → src/utils/api.ts
- `DashboardHome()` --calls--> `fetchLabels()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/utils/api.ts

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.15
Nodes (32): Props, InfoText(), Props, page(), IProjectCategory, ProjectCategoriesPage(), CategoriasPage(), EMPTY_FORM (+24 more)

### Community 1 - "dependencies"
Cohesion: 0.06
Nodes (36): lowlight, multer, next, dependencies, lowlight, multer, next, react (+28 more)

### Community 2 - "devDependencies"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, eslint-plugin-sonarjs, devDependencies, eslint, eslint-config-next (+25 more)

### Community 3 - "VidaItemForm.tsx"
Cohesion: 0.12
Nodes (24): ConfirmVidaDelete(), AMBITOS, EnlaceRow, MediaRow, Props, toDateInput(), VidaItemForm(), Props (+16 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 5 - "MediaGalery.tsx"
Cohesion: 0.13
Nodes (18): MediaPickerModal(), MediaPickerModalProps, Card(), CardProps, ImageCard(), ImageCardProps, ImageUpload(), ImageUploadProps (+10 more)

### Community 6 - "RichTextEditor.tsx"
Cohesion: 0.11
Nodes (19): CarouselComponent(), CarouselExtension, Commands, @tiptap/core, extensions, lowlight, RichTextEditorProps, RichTextEditor (+11 more)

### Community 7 - "BackButton.tsx"
Cohesion: 0.19
Nodes (14): BackButton(), EditPost(), DisplayLabelsAdd(), NewPost(), IComment, ILabel, IPost, IUser (+6 more)

### Community 8 - "fetchPosts"
Cohesion: 0.15
Nodes (14): ConfirmProjectDelete(), Props, Project, ProjectList(), ProjectListProps, AnalyticsPage(), PostStat, DashboardHome() (+6 more)

### Community 9 - "comments/page.tsx"
Cohesion: 0.24
Nodes (9): Comment, CommentList(), CommentListProps, Comment, CommentsPage(), CommentManagement(), approveComment(), deleteComment() (+1 more)

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
- **109 isolated node(s):** `Props`, `Props`, `IProjectCategory`, `FormState`, `Props` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `ILabel` connect `BackButton.tsx` to `api.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `IProjectCategory` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1475609756097561 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `VidaItemForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12413793103448276 - nodes in this community are weakly interconnected._