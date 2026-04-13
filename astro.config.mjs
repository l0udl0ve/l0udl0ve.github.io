import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import katex from "katex";
import "katex/dist/contrib/mhchem.mjs"; // 加载 mhchem 扩展
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkMath from "remark-math";
import rehypeCallouts from "rehype-callouts";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, siteConfig } from "./src/config";
import { i18n } from "./src/i18n/translation";
import I18nKey from "./src/i18n/i18nKey";
import { pluginLanguageBadge } from "expressive-code-language-badge"; /* Language Badge */
import { pluginCollapsible } from "expressive-code-collapsible"; /* Collapsible */
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import mdx from "@astrojs/mdx";
import rehypeEmailProtection from "./src/plugins/rehype-email-protection.mjs";
import rehypeExternalLinks from "./src/plugins/rehype-external-links.mjs";
import rehypeFigure from "./src/plugins/rehype-figure.mjs";
import { remarkImageGrid } from "./src/plugins/remark-image-grid.js";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site_url,
	
	base: "/",
	trailingSlash: "always",

	// 图像优化配置
	image: {
		layout: "constrained",
	},

	// Obsidian 兼容配置：嵌套文件夹 + 图片路径
	content: {
		collections: {
			posts: {
				loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
				schema: z.object({
					title: z.string(),
					published: z.date(),
					updated: z.date().optional(),
					draft: z.boolean().optional().default(false),
					description: z.string().optional().default(""),
					image: z.string().optional().default(""),
					tags: z.array(z.string()).optional().default([]),
					category: z.string().optional().nullable().default(""),
					lang: z.string().optional().default(""),
					pinned: z.boolean().optional().default(false),
					author: z.string().optional().default(""),
				}),
			},
		},
	},

	experimental: {
		rustCompiler: false,
		queuedRendering: { enabled: true },
	},

	integrations: [
		swup({
			theme: false,
			animationClass: "transition-swup-",
			containers: [
				"#banner-overlay-container",
				"#banner-dim-container",
				"#swup-container",
				"#left-sidebar-dynamic",
				"#right-sidebar-dynamic",
				"#floating-toc-wrapper",
			],
			smoothScrolling: false,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				return event.state && event.state.url && event.state.url.includes("#");
			},
		}),
		icon({
			include: {
				"material-symbols": ["*"],
				"fa7-brands": ["*"],
				"fa7-regular": ["*"],
				"fa7-solid": ["*"],
				"simple-icons": ["*"],
				mdi: ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			plugins: [
				...(expressiveCodeConfig.pluginLanguageBadge?.enable === true
					? [pluginLanguageBadge()]
					: []),
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				...(expressiveCodeConfig.pluginCollapsible?.enable === true
					? [
							pluginCollapsible({
								lineThreshold: expressiveCodeConfig.pluginCollapsible.lineThreshold || 15,
								previewLines: expressiveCodeConfig.pluginCollapsible.previewLines || 8,
								defaultCollapsed: expressiveCodeConfig.pluginCollapsible.defaultCollapsed ?? true,
								expandButtonText: i18n(I18nKey.codeCollapsibleShowMore),
								collapseButtonText: i18n(I18nKey.codeCollapsibleShowLess),
								expandedAnnouncement: i18n(I18nKey.codeCollapsibleExpanded),
								collapsedAnnouncement: i18n(I18nKey.codeCollapsibleCollapsed),
							}),
						]
					: []),
			],
			defaultProps: {
				wrap: false,
				overridesByLang: {
					shellsession: { showLineNumbers: false },
				},
			},
			styleOverrides: {
				borderRadius: "0.75rem",
				codeFontSize: "0.875rem",
				codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {},
				textMarkers: { delHue: 0, insHue: 180, markHue: 250 },
				languageBadge: { fontSize: "0.75rem", fontWeight: "bold", borderRadius: "0.25rem", opacity: "1", borderWidth: "0px", borderColor: "transparent" },
			},
			frames: { showCopyToClipboardButton: true },
		}),
		svelte(),
		sitemap({
			filter: (page) => {
				const url = new URL(page);
				const pathname = url.pathname;
				if (pathname === "/friends/" && !siteConfig.pages.friends) return false;
				if (pathname === "/sponsor/" && !siteConfig.pages.sponsor) return false;
				if (pathname === "/guestbook/" && !siteConfig.pages.guestbook) return false;
				if (pathname === "/bangumi/" && !siteConfig.pages.bangumi) return false;
				if (pathname === "/gallery/" && !siteConfig.pages.gallery) return false;
				return true;
			},
		}),
		mdx(),
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkImageGrid,
			remarkExcerpt,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
			remarkMermaid,
		],
		rehypePlugins: [
			[rehypeKatex, { katex }],
			[rehypeCallouts, { theme: siteConfig.rehypeCallouts.theme }],
			rehypeSlug,
			rehypeMermaid,
			rehypeFigure,
			[rehypeExternalLinks, { siteUrl: siteConfig.site_url }],
			[rehypeEmailProtection, { method: "base64" }],
			[rehypeComponents, { components: { github: GithubCardComponent } }],
			[rehypeAutolinkHeadings, {
				behavior: "append",
				properties: { className: ["anchor"] },
				content: { type: "element", tagName: "span", properties: { className: ["anchor-icon"], "data-pagefind-ignore": true }, children: [{ type: "text", value: "#" }] },
			}],
		],
	},
	vite: {
		plugins: [tailwindcss()],
		server: {
			watch: { ignored: ["**/package/**", "**/Firefly-docs/**"] },
			// ✅ 修复：允许访问整个项目文件（解决CSS/样式/图片报错）
			fs: { allow: ["."] }
		},
		resolve: {
			alias: { "@rehype-callouts-theme": `rehype-callouts/theme/${siteConfig.rehypeCallouts.theme}` },
		},
		build: {
			minify: "esbuild",
			esbuildOptions: { minify: true, drop: ["console", "debugger"] },
			rollupOptions: {
				onwarn(warning, warn) {
					if (warning.message.includes("is dynamically imported by") && warning.message.includes("but also statically imported by")) return;
					warn(warning);
				},
			},
			cssCodeSplit: true,
			cssMinify: "esbuild",
			assetsInlineLimit: 4096,
		},
	},
});