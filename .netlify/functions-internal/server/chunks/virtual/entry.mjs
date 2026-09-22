import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineProdDiagnostics } from 'nostics';
import { ansiFormatter } from 'nostics/formatters/ansi';
import { getCurrentScope, ref, watchEffect, getCurrentInstance, onBeforeUnmount, onDeactivated, onActivated, createApp, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, hasInjectionContext, inject, defineAsyncComponent, mergeProps, defineComponent, toRef, computed, useAttrs, useTemplateRef, watch, h, isReadonly, useSSRContext, isRef, isShallow, isReactive, toRaw } from 'vue';
import { c as createError, l as defu, m as hasProtocol, w as withLeadingSlash, j as joinURL, n as parseURL, $ as $fetch, o as baseURL, q as isEqual, s as stringifyParsedURL, t as stringifyQuery, v as parseQuery, x as withQuery, y as sanitizeStatusCode, e as encodePath, z as decodePath, A as isScriptProtocol, B as encodeParam } from '../nitro/nitro.mjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderSlot, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { FlatMetaPlugin } from 'unhead/plugins';
import { hasOwn, walkResolver } from 'unhead/utils';
import { i as injectHead$1, V as VueResolver, h as headSymbol } from '../routes/renderer.mjs';

function useHead(input, options = {}) {
  const head = options.head || injectHead$1();
  return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
  const scope = getCurrentScope();
  if (scope && !scope.active) {
    return { patch() {
    }, dispose() {
    }, _i: -1 };
  }
  const deactivated = ref(false);
  if (options.onRendered && scope) {
    const _onRendered = options.onRendered;
    options = { ...options, onRendered: (ctx) => scope.run(() => _onRendered(ctx)) };
  }
  let entry;
  watchEffect(() => {
    const i = deactivated.value ? {} : walkResolver(input, VueResolver);
    if (entry) {
      entry.patch(i);
    } else {
      entry = head.push(i, options);
    }
  });
  const vm = getCurrentInstance();
  if (vm) {
    onBeforeUnmount(() => {
      entry.dispose();
    });
    onDeactivated(() => {
      deactivated.value = true;
    });
    onActivated(() => {
      deactivated.value = false;
    });
  }
  return entry;
}
function normalizeSeoMetaInput(input) {
  if (input._flatMeta)
    return input;
  const meta = {};
  for (const key in input) {
    if (!hasOwn(input, key) || key === "title" || key === "titleTemplate")
      continue;
    meta[key] = input[key];
  }
  return {
    title: input.title,
    titleTemplate: input.titleTemplate,
    _flatMeta: meta
  };
}
function useSeoMeta(input = {}, options = {}) {
  const head = options.head || injectHead$1();
  head.use(FlatMetaPlugin);
  const entry = useHead(normalizeSeoMetaInput(input), options);
  const corePatch = entry.patch;
  if (!entry.__patched) {
    entry.patch = (input2) => corePatch(normalizeSeoMetaInput(input2));
    entry.__patched = true;
  }
  return entry;
}

function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}

function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
const _WeakRef = globalThis.WeakRef || class StrongRef {
	#value;
	constructor(value) {
		this.#value = value;
	}
	deref() {
		return this.#value;
	}
};
function createContext(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new _WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance() ?? null;
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
			currentInstance = instance;
			isSingleton = true;
		},
		unset: () => {
			currentInstance = void 0;
			isSingleton = false;
		},
		call: (instance, callback) => {
			checkConflict(instance);
			currentInstance = instance;
			try {
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
			}
		},
		async callAsync(instance, callback) {
			currentInstance = instance;
			const onRestore = () => {
				currentInstance = instance;
			};
			const onLeave = () => currentInstance === instance ? onRestore : void 0;
			asyncHandlers.add(onLeave);
			try {
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

//#region node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
var colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
ansiFormatter(colors);
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var nuxtLinkDefaults = {
	"componentName": "NuxtLink"};
//#endregion
//#region node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.5.2";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const contextCaller = async function(hooks, args) {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
//#endregion
//#region node_modules/nuxt/dist/app/utils.js
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
//#endregion
//#region node_modules/nuxt/dist/app/components/injections.js
var PageRouteSymbol = Symbol("route");
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = () => {
	return useNuxtApp()?.$router;
};
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = scope.parent;
	}
	return false;
}
/** @since 3.0.0 */
var useRoute = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
/**
* A helper that aids in programmatic navigation within your Nuxt application.
*
* Can be called on the server and on the client, within pages, route middleware, plugins, and more.
* @param {RouteLocationRaw | undefined | null} [to] - The route to navigate to. Accepts a route object, string path, `undefined`, or `null`. Defaults to '/'.
* @param {NavigateToOptions} [options] - Optional customization for controlling the behavior of the navigation.
* @returns {Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw} The navigation result, which varies depending on context and options.
* @see https://nuxt.com/docs/4.x/api/utils/navigate-to
* @since 3.0.0
*/
var navigateTo = (to, options) => {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const { protocol } = new URL(toPath, "http://localhost");
		if (protocol && isScriptProtocol(protocol)) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._scope.stop();
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL(url);
	return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError$1(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError$1 = (error) => {
	if (typeof error !== "string" && error.statusText) error.message ??= error.statusText;
	const nuxtError = createError(error);
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch.create({ baseURL: baseURL() });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Frouter.options.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var sensitiveMatcher = /* @__PURE__ */ (() => {
	const $0 = { prerender: true };
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
		if (p === "") r.push({ data: $0 });
		else if (p.charCodeAt(p.length - 1) === 47) {
			if (p === "/") r.push({ data: $0 });
		}
		return r.reverse();
	};
})();
var foldedMatcher = sensitiveMatcher;
var decodeRoutePath = function decodeRoutePath(path) {
	if (!path.includes("%")) return path;
	const queryIndex = path.indexOf("?");
	const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
	try {
		return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
	} catch {
		return path;
	}
};
var normalizePath = (path, fold) => {
	if (typeof path !== "string") return path;
	const decoded = decodeRoutePath(path);
	return fold ? decoded.toLowerCase() : decoded;
};
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = (path) => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
//#endregion
//#region node_modules/nuxt/dist/app/composables/manifest.js
var routeRulesMatcher = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default;
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [/* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
//#endregion
//#region node_modules/nuxt/dist/app/plugins/router.js
function getRouteFromPath(fullPath) {
	const route = fullPath && typeof fullPath === "object" ? fullPath : {};
	if (typeof fullPath === "object") fullPath = stringifyParsedURL({
		pathname: fullPath.path || "",
		search: stringifyQuery(fullPath.query || {}),
		hash: fullPath.hash || ""
	});
	const url = new URL(fullPath.toString(), "http://localhost");
	return {
		path: url.pathname,
		fullPath,
		query: parseQuery(url.search),
		hash: url.hash,
		params: route.params || {},
		name: void 0,
		matched: route.matched || [],
		redirectedFrom: void 0,
		meta: route.meta || {},
		href: fullPath
	};
}
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	setup(nuxtApp) {
		const initialURL = nuxtApp.ssrContext.url;
		const routes = [];
		const hooks = {
			"navigate:before": [],
			"resolve:before": [],
			"navigate:after": [],
			"error": []
		};
		const registerHook = (hook, guard) => {
			hooks[hook].push(guard);
			return () => {
				const index = hooks[hook].indexOf(guard);
				if (index !== -1) hooks[hook].splice(index, 1);
			};
		};
		(/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
		const route = reactive(getRouteFromPath(initialURL));
		let navigationCounter = 0;
		async function handleNavigation(url, replace) {
			const navigationId = ++navigationCounter;
			try {
				const to = getRouteFromPath(url);
				for (const middleware of hooks["navigate:before"]) {
					const result = await middleware(to, route);
					if (navigationId !== navigationCounter) return;
					if (result === false || result instanceof Error) return;
					if (typeof result === "string" && result.length) return await handleNavigation(result, true);
				}
				for (const handler of hooks["resolve:before"]) {
					await handler(to, route);
					if (navigationId !== navigationCounter) return;
				}
				Object.assign(route, to);
				for (const middleware of hooks["navigate:after"]) await middleware(to, route);
			} catch (err) {
				for (const handler of hooks.error) await handler(err);
			}
		}
		const router = {
			currentRoute: computed(() => route),
			isReady: () => Promise.resolve(),
			options: {},
			install: () => Promise.resolve(),
			push: (url) => handleNavigation(url),
			replace: (url) => handleNavigation(url),
			back: () => (void 0).history.go(-1),
			go: (delta) => (void 0).history.go(delta),
			forward: () => (void 0).history.go(1),
			beforeResolve: (guard) => registerHook("resolve:before", guard),
			beforeEach: (guard) => registerHook("navigate:before", guard),
			afterEach: (guard) => registerHook("navigate:after", guard),
			onError: (handler) => registerHook("error", handler),
			resolve: getRouteFromPath,
			addRoute: (parentName, route) => {
				routes.push(route);
			},
			getRoutes: () => routes,
			hasRoute: (name) => routes.some((route) => route.name === name),
			removeRoute: (name) => {
				const index = routes.findIndex((route) => route.name === name);
				if (index !== -1) routes.splice(index, 1);
			}
		};
		nuxtApp.vueApp.component("RouterLink", defineComponent({
			functional: true,
			props: {
				to: {
					type: String,
					required: true
				},
				custom: Boolean,
				replace: Boolean,
				activeClass: String,
				exactActiveClass: String,
				ariaCurrentValue: String
			},
			setup: (props, { slots }) => {
				const navigate = () => handleNavigation(props.to, props.replace);
				return () => {
					const route = router.resolve(props.to);
					return props.custom ? slots.default?.({
						href: props.to,
						navigate,
						route
					}) : h("a", {
						href: props.to,
						onClick: (e) => {
							e.preventDefault();
							return navigate();
						}
					}, slots);
				};
			}
		}));
		nuxtApp._route = route;
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const initialLayout = nuxtApp.payload.state._layout;
		const initialLayoutProps = nuxtApp.payload.state._layoutProps;
		nuxtApp.hooks.hookOnce("app:created", async () => {
			router.beforeEach(async (to, from) => {
				to.meta = reactive(to.meta || {});
				if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
					to.meta.layout = initialLayout;
					to.meta.layoutProps = initialLayoutProps;
				}
				nuxtApp._processingMiddleware = true;
				nuxtApp._middlewareTo = to;
				if (!nuxtApp.ssrContext?.islandContext) {
					const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
					const routeRules = getRouteRules({ path: to.path });
					if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) {
						const guard = nuxtApp._middleware.named[key];
						if (!guard) continue;
						if (routeRules.appMiddleware[key]) middlewareEntries.add(guard);
						else middlewareEntries.delete(guard);
					}
					for (const middleware of middlewareEntries) {
						const result = await nuxtApp.runWithContext(() => middleware(to, from));
						if (result === false || result instanceof Error) {
							const error = result || createError({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`,
								data: { path: initialURL }
							});
							delete nuxtApp._processingMiddleware;
							delete nuxtApp._middlewareTo;
							return nuxtApp.runWithContext(() => showError(error));
						}
						if (result === true) continue;
						if (result || result === false) return result;
					}
				}
			});
			router.afterEach(() => {
				delete nuxtApp._processingMiddleware;
				delete nuxtApp._middlewareTo;
			});
			await router.replace(initialURL);
			if (!isEqual(route.fullPath, initialURL)) await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
		});
		return { provide: {
			route,
			router
		} };
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject(headSymbol);
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead$1(input, options = {}) {
	const head = options.head || injectHead(options.nuxt);
	return useHead(input, {
		head,
		...options
	});
}
function useSeoMeta$1(input, options = {}) {
	const head = options.head || injectHead(options.nuxt);
	return useSeoMeta(input, {
		head,
		...options
	});
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.server.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default = [
	plugin$2,
	plugin$1,
	/* @__PURE__ */ defineNuxtPlugin({
		name: "nuxt:revive-payload:server",
		setup() {
			for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
		}
	}),
	/* @__PURE__ */ defineNuxtPlugin({ name: "nuxt:global-components" })
];
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/utils/meta.js
async function imageMeta(_ctx, url) {
	return await _imageMeta(url).catch((err) => {
		console.error("Failed to get image meta for " + url, err + "");
		return {
			width: 0,
			height: 0,
			ratio: 0
		};
	});
}
async function _imageMeta(url) {
	{
		const metadata = (await import('image-meta').then((r) => r.imageMeta))(await fetch(url).then((res) => res.buffer()));
		if (!metadata) throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
		const { width, height } = metadata;
		return {
			width,
			height,
			ratio: width && height ? width / height : void 0
		};
	}
}
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/utils/index.js
function createMapper(map) {
	return ((key) => key !== void 0 ? map[key] || key : map.missingValue);
}
function createOperationsGenerator(config = {}) {
	const formatter = config.formatter;
	const keyMap = config.keyMap && typeof config.keyMap !== "function" ? createMapper(config.keyMap) : config.keyMap;
	const map = {};
	for (const key in config.valueMap) {
		const valueKey = key;
		const value = config.valueMap[valueKey];
		map[valueKey] = typeof value === "object" ? createMapper(value) : value;
	}
	return (modifiers) => {
		const operations = [];
		for (const _key in modifiers) {
			const key = _key;
			if (typeof modifiers[key] === "undefined") continue;
			const value = typeof map[key] === "function" ? map[key](modifiers[key]) : modifiers[key];
			operations.push([keyMap ? keyMap(key) : key, value]);
		}
		if (formatter) return operations.map((entry) => formatter(...entry)).join(config.joinWith ?? "&");
		return new URLSearchParams(operations).toString();
	};
}
function parseDensities(input = "") {
	if (input === void 0 || !input.length) return [];
	const densities = /* @__PURE__ */ new Set();
	for (const density of input.split(" ")) {
		const d = Number.parseInt(density.replace("x", ""));
		if (d) densities.add(d);
	}
	return Array.from(densities);
}
function checkDensities(densities) {
	if (densities.length === 0) throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
}
function parseSize(input = "") {
	if (typeof input === "number") return input;
	if (typeof input === "string") {
		if (input.replace("px", "").match(/^\d+$/g)) return Number.parseInt(input, 10);
	}
}
function parseSizes(input) {
	const sizes = {};
	if (typeof input === "string") for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
		const s = entry.split(":");
		if (s.length !== 2) sizes["1px"] = s[0].trim();
		else sizes[s[0].trim()] = s[1].trim();
	}
	else Object.assign(sizes, input);
	return sizes;
}
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/image.js
function createImage(globalOptions) {
	const ctx = { options: globalOptions };
	const getImage = (input, options = {}) => {
		const image = resolveImage(ctx, input, options);
		return image;
	};
	const $img = ((input, modifiers, options) => getImage(input, defu({ modifiers }, options)).url);
	for (const presetName in globalOptions.presets) $img[presetName] = ((source, modifiers, options) => $img(source, modifiers, {
		...globalOptions.presets[presetName],
		...options
	}));
	$img.options = globalOptions;
	$img.getImage = getImage;
	$img.getMeta = ((input, options) => getMeta(ctx, input, options));
	$img.getSizes = ((input, options) => getSizes(ctx, input, options));
	ctx.$img = $img;
	return $img;
}
async function getMeta(ctx, input, options) {
	const image = resolveImage(ctx, input, { ...options });
	if (typeof image.getMeta === "function") return await image.getMeta();
	else return await imageMeta(ctx, image.url);
}
function resolveImage(ctx, input, options) {
	if (input && typeof input !== "string") throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
	if (!input || input.startsWith("data:")) return { url: input };
	const { setup, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
	const provider = setup();
	const preset = getPreset(ctx, options.preset);
	input = hasProtocol(input) ? input : withLeadingSlash(input);
	if (!provider.supportsAlias) {
		for (const base in ctx.options.alias) if (input.startsWith(base)) {
			const alias = ctx.options.alias[base];
			if (alias) input = joinURL(alias, input.slice(base.length));
		}
	}
	if (provider.validateDomains && hasProtocol(input)) {
		const inputHost = parseURL(input).host;
		if (!ctx.options.domains.find((d) => d === inputHost)) return { url: input };
	}
	const _options = defu(options, preset, defaults);
	const resolvedOptions = {
		..._options,
		modifiers: {
			..._options.modifiers,
			width: _options.modifiers?.width ? parseSize(_options.modifiers.width) : void 0,
			height: _options.modifiers?.height ? parseSize(_options.modifiers.height) : void 0
		}
	};
	const image = provider.getImage(input, resolvedOptions, ctx);
	image.format ||= resolvedOptions.modifiers.format || "";
	return image;
}
function getProvider(ctx, name) {
	const provider = ctx.options.providers[name];
	if (!provider) throw new Error("Unknown provider: " + name);
	return provider;
}
function getPreset(ctx, name) {
	if (!name) return {};
	if (!ctx.options.presets[name]) throw new Error("Unknown preset: " + name);
	return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
	const preset = getPreset(ctx, opts.preset);
	const merged = defu(opts, preset);
	const width = parseSize(merged.modifiers?.width);
	const height = parseSize(merged.modifiers?.height);
	const sizes = merged.sizes ? parseSizes(merged.sizes) : {};
	const _densities = merged.densities?.trim();
	const densities = _densities ? parseDensities(_densities) : ctx.options.densities;
	checkDensities(densities);
	const hwRatio = width && height ? height / width : 0;
	const sizeVariants = [];
	const srcsetVariants = [];
	if (Object.keys(sizes).length >= 1) {
		for (const key in sizes) {
			const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
			if (variant === void 0) continue;
			sizeVariants.push({
				size: variant.size,
				screenMaxWidth: variant.screenMaxWidth,
				media: `(max-width: ${variant.screenMaxWidth - 1}px)`
			});
			for (const density of densities) srcsetVariants.push({
				width: variant._cWidth * density,
				src: getVariantSrc(ctx, input, opts, variant, density)
			});
		}
		finaliseSizeVariants(sizeVariants);
	} else for (const density of densities) {
		const key = Object.keys(sizes)[0];
		let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
		if (variant === void 0) variant = {
			size: "",
			screenMaxWidth: 0,
			_cWidth: opts.modifiers?.width,
			_cHeight: opts.modifiers?.height
		};
		srcsetVariants.push({
			width: density,
			src: getVariantSrc(ctx, input, opts, variant, density)
		});
	}
	finaliseSrcsetVariants(srcsetVariants);
	const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
	const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
	const suffix = sizesVal ? "w" : "x";
	return {
		sizes: sizesVal,
		srcset: srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", "),
		src: defaultVariant?.src
	};
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
	const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
	const isFluid = size.endsWith("vw");
	if (!isFluid && /^\d+$/.test(size)) size = size + "px";
	if (!isFluid && !size.endsWith("px")) return;
	let _cWidth = Number.parseInt(size);
	if (!screenMaxWidth || !_cWidth) return;
	if (isFluid) _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
	const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
	return {
		size,
		screenMaxWidth,
		_cWidth,
		_cHeight
	};
}
function getVariantSrc(ctx, input, opts, variant, density) {
	return ctx.$img(input, {
		...opts.modifiers,
		width: variant._cWidth ? variant._cWidth * density : void 0,
		height: variant._cHeight ? variant._cHeight * density : void 0
	}, opts);
}
function finaliseSizeVariants(sizeVariants) {
	sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
	let previousMedia = null;
	for (let i = sizeVariants.length - 1; i >= 0; i--) {
		const sizeVariant = sizeVariants[i];
		if (sizeVariant.media === previousMedia) sizeVariants.splice(i, 1);
		previousMedia = sizeVariant.media;
	}
	for (let i = 0; i < sizeVariants.length; i++) sizeVariants[i].media = sizeVariants[i + 1]?.media || "";
}
function finaliseSrcsetVariants(srcsetVariants) {
	srcsetVariants.sort((v1, v2) => v1.width - v2.width);
	let previousWidth = null;
	for (let i = srcsetVariants.length - 1; i >= 0; i--) {
		const sizeVariant = srcsetVariants[i];
		if (sizeVariant.width === previousWidth) srcsetVariants.splice(i, 1);
		previousWidth = sizeVariant.width;
	}
}
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/utils/provider.js
function defineProvider(setup) {
	let result;
	return () => {
		if (result) return result;
		result = typeof setup === "function" ? setup() : setup;
		return result;
	};
}
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/providers/ipx.js
var operationsGenerator = createOperationsGenerator({
	keyMap: {
		format: "f",
		width: "w",
		height: "h",
		resize: "s",
		quality: "q",
		background: "b",
		position: "pos"
	},
	formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val.toString())
});
var ipx_default = defineProvider({
	validateDomains: true,
	supportsAlias: true,
	getImage: (src, { modifiers, baseURL }, ctx) => {
		if (modifiers.width && modifiers.height) {
			modifiers.resize = `${modifiers.width}x${modifiers.height}`;
			delete modifiers.width;
			delete modifiers.height;
		}
		const params = operationsGenerator(modifiers) || "_";
		if (!baseURL) baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
		return { url: joinURL(baseURL, params, encodePath(src)) };
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fimage-options.mjs
var imageOptions = {
	screens: {
		"sm": 640,
		"md": 768,
		"lg": 1024,
		"xl": 1280,
		"2xl": 1536
	},
	presets: {},
	domains: [],
	alias: {},
	densities: [1, 2],
	format: ["avif", "webp"],
	quality: 82,
	/** @type {"ipx"} */
	provider: "ipx",
	providers: { ["ipx"]: {
		setup: ipx_default,
		defaults: {}
	} }
};
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/composables.js
var useImage = (event) => {
	const config = /* @__PURE__ */ useRuntimeConfig();
	const nuxtApp = useNuxtApp();
	return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
		...imageOptions,
		event: nuxtApp.ssrContext?.event,
		nuxt: { baseURL: config.app.baseURL },
		runtimeConfig: config
	}));
};
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/utils/props.js
var useImageProps = (props) => {
	const $img = useImage();
	return {
		providerOptions: computed(() => ({
			provider: props.provider,
			preset: props.preset
		})),
		normalizedAttrs: computed(() => ({
			width: parseSize(props.width),
			height: parseSize(props.height),
			crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
			nonce: props.nonce
		})),
		imageModifiers: computed(() => {
			return {
				...props.modifiers,
				width: props.width,
				height: props.height,
				format: props.format,
				quality: props.quality || $img.options.quality,
				background: props.background,
				fit: props.fit
			};
		})
	};
};
//#endregion
//#region node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue
var _sfc_main$2 = {
	__name: "NuxtImg",
	__ssrInlineRender: true,
	props: {
		custom: {
			type: Boolean,
			required: false
		},
		placeholder: {
			type: [
				Boolean,
				String,
				Number,
				Array
			],
			required: false
		},
		placeholderClass: {
			type: String,
			required: false
		},
		src: {
			type: String,
			required: false
		},
		format: {
			type: String,
			required: false
		},
		quality: {
			type: [String, Number],
			required: false
		},
		background: {
			type: String,
			required: false
		},
		fit: {
			type: String,
			required: false
		},
		modifiers: {
			type: Object,
			required: false
		},
		preset: {
			type: String,
			required: false
		},
		provider: {
			type: null,
			required: false
		},
		sizes: {
			type: [String, Object],
			required: false
		},
		densities: {
			type: String,
			required: false
		},
		preload: {
			type: [Boolean, Object],
			required: false
		},
		width: {
			type: [String, Number],
			required: false
		},
		height: {
			type: [String, Number],
			required: false
		},
		crossorigin: {
			type: [String, Boolean],
			required: false
		},
		nonce: {
			type: String,
			required: false
		}
	},
	emits: ["load", "error"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const $img = useImage();
		const { providerOptions, normalizedAttrs, imageModifiers } = useImageProps(props);
		const sizes = computed(() => $img.getSizes(props.src, {
			...providerOptions.value,
			sizes: props.sizes,
			densities: props.densities,
			modifiers: imageModifiers.value
		}));
		const placeholderLoaded = ref(false);
		const attrs = useAttrs();
		const imgAttrs = computed(() => ({
			...normalizedAttrs.value,
			"data-nuxt-img": "",
			...!props.placeholder || placeholderLoaded.value ? {
				sizes: sizes.value.sizes,
				srcset: sizes.value.srcset
			} : {},
			onerror: "this.setAttribute('data-error', 1)",
			...attrs
		}));
		const placeholder = computed(() => {
			if (placeholderLoaded.value) return false;
			const placeholder2 = props.placeholder === "" ? [10, 10] : props.placeholder;
			if (!placeholder2) return false;
			if (typeof placeholder2 === "string") return placeholder2;
			const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2] : [];
			return $img(props.src, {
				...imageModifiers.value,
				width,
				height,
				quality,
				blur
			}, providerOptions.value);
		});
		const mainSrc = computed(() => props.sizes ? sizes.value.src : $img(props.src, imageModifiers.value, providerOptions.value));
		const src = computed(() => placeholder.value || mainSrc.value);
		if (props.preload) {
			const isResponsive = sizes.value.srcset.includes("x, ") || !!sizes.value.sizes;
			useHead$1({ link: [{
				rel: "preload",
				as: "image",
				nonce: props.nonce,
				crossorigin: normalizedAttrs.value.crossorigin,
				href: isResponsive ? sizes.value.src : src.value,
				...sizes.value.sizes && { imagesizes: sizes.value.sizes },
				...isResponsive && { imagesrcset: sizes.value.srcset },
				...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
			}] });
		}
		useNuxtApp().isHydrating;
		const imgEl = useTemplateRef("imgEl");
		__expose({ imgEl });
		return (_ctx, _push, _parent, _attrs) => {
			if (!__props.custom) _push(`<img${ssrRenderAttrs(mergeProps({
				ref_key: "imgEl",
				ref: imgEl,
				class: placeholder.value ? __props.placeholderClass : void 0
			}, imgAttrs.value, { src: src.value }, _attrs))}>`);
			else ssrRenderSlot(_ctx.$slots, "default", {
				imgAttrs: imgAttrs.value,
				isLoaded: placeholderLoaded.value,
				src: src.value
			}, null, _push, _parent);
		};
	}
};
var _sfc_setup$5 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/compat/interval.js
var setInterval = (() => {
	appDiagnostics.NUXT_E1004();
});
//#endregion
//#region components/PhotoGallery.vue?vue&type=script&setup=true&lang.ts
var PhotoGallery_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PhotoGallery",
	__ssrInlineRender: true,
	props: { images: {} },
	setup(__props) {
		const props = __props;
		const activeIndex = ref(0);
		const isPlaying = ref(false);
		ref(0);
		let timer;
		const editableCaptions = reactive({});
		for (const image of props.images) editableCaptions[image.src] = {
			...image.captions,
			agentInstructions: image.captions.agentInstructions ?? "",
			selected: "original"
		};
		const activeImage = computed(() => props.images[activeIndex.value]);
		const activeCaptions = computed(() => editableCaptions[activeImage.value.src]);
		const captionFields = [
			{
				key: "original",
				label: "Original",
				selectable: true
			},
			{
				key: "alternate",
				label: "Alternate",
				selectable: true
			},
			{
				key: "custom",
				label: "Your text",
				selectable: true,
				placeholder: "Write your caption here…"
			},
			{
				key: "agentInstructions",
				label: "Agent Instructions",
				selectable: false,
				placeholder: "Notes for the agent about this photo…"
			}
		];
		function stopTimer() {
			if (timer) clearInterval(timer);
			timer = void 0;
		}
		function syncTimer() {
			stopTimer();
			if (isPlaying.value) timer = setInterval();
		}
		watch(isPlaying, syncTimer);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "gallery",
				role: "region",
				"aria-roledescription": "carousel",
				"aria-label": "River to Table photo story",
				tabindex: "0"
			}, _attrs))}><div class="gallery__stage"><figure class="gallery__figure"><div class="gallery__media">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				class: "gallery__image",
				src: unref(activeImage).src,
				alt: unref(activeImage).alt,
				style: { objectPosition: unref(activeImage).position ?? "center" },
				width: "1600",
				height: "1067",
				sizes: "(max-width: 760px) 92vw, (max-width: 1200px) 70vw, 880px",
				loading: "lazy"
			}, null, _parent));
			_push(`<div class="gallery__controls"><button type="button" aria-label="Previous photo"><span aria-hidden="true">←</span></button><span aria-live="polite">${ssrInterpolate(String(unref(activeIndex) + 1).padStart(2, "0"))} / ${ssrInterpolate(String(__props.images.length).padStart(2, "0"))}</span><button type="button" aria-label="Next photo"><span aria-hidden="true">→</span></button><button class="gallery__play" type="button"${ssrRenderAttr("aria-label", unref(isPlaying) ? "Pause slideshow" : "Play slideshow")}${ssrRenderAttr("aria-pressed", unref(isPlaying))}>${ssrInterpolate(unref(isPlaying) ? "Pause" : "Play")}</button></div></div><figcaption class="gallery__caption"><span class="eyebrow">${ssrInterpolate(unref(activeImage).title)}</span><!--[-->`);
			ssrRenderList(captionFields, (field) => {
				_push(`<div class="${ssrRenderClass([{
					"is-selected": field.selectable && unref(activeCaptions).selected === field.key,
					"is-instructions": field.key === "agentInstructions"
				}, "gallery__caption-row"])}"><div class="gallery__caption-meta">`);
				if (field.selectable) _push(`<label class="gallery__caption-choice"${ssrRenderAttr("for", `caption-choice-${field.key}`)}><input${ssrRenderAttr("id", `caption-choice-${field.key}`)} type="radio"${ssrRenderAttr("name", `caption-choice-${unref(activeImage).src}`)}${ssrRenderAttr("value", field.key)}${ssrIncludeBooleanAttr(unref(activeCaptions).selected === field.key) ? " checked" : ""}><span>${ssrInterpolate(field.label)}</span></label>`);
				else _push(`<span class="gallery__caption-label">${ssrInterpolate(field.label)}</span>`);
				_push(`</div><div class="gallery__caption-text" contenteditable="true" role="textbox"${ssrRenderAttr("aria-label", `${field.label} caption`)}${ssrRenderAttr("data-placeholder", field.placeholder || void 0)}>${ssrInterpolate(unref(activeCaptions)[field.key])}</div></div>`);
			});
			_push(`<!--]--></figcaption></figure></div><div class="gallery__thumbs" aria-label="Choose a photo"><!--[-->`);
			ssrRenderList(__props.images, (image, index) => {
				_push(`<button type="button" class="${ssrRenderClass({ "is-active": index === unref(activeIndex) })}"${ssrRenderAttr("aria-label", `Show photo ${index + 1}: ${image.title}`)}${ssrRenderAttr("aria-current", index === unref(activeIndex) ? "true" : void 0)}>`);
				_push(ssrRenderComponent(_component_NuxtImg, {
					src: image.src,
					alt: "",
					width: "144",
					height: "96",
					sizes: "72px",
					loading: "lazy"
				}, null, _parent));
				_push(`</button>`);
			});
			_push(`<!--]--></div></div>`);
		};
	}
});
//#endregion
//#region components/PhotoGallery.vue
var _sfc_setup$4 = PhotoGallery_vue_vue_type_script_setup_true_lang_default.setup;
PhotoGallery_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PhotoGallery.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var PhotoGallery_default = Object.assign(PhotoGallery_vue_vue_type_script_setup_true_lang_default, { __name: "PhotoGallery" });
//#endregion
//#region components/RefinedGallery.vue?vue&type=script&setup=true&lang.ts
var RefinedGallery_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "RefinedGallery",
	__ssrInlineRender: true,
	props: { images: {} },
	setup(__props) {
		const props = __props;
		const activeIndex = ref(0);
		ref(0);
		const activeImage = computed(() => props.images[activeIndex.value]);
		const activeCaption = computed(() => {
			return (activeImage.value.src.split("/").pop() ?? "").replace(/^\d+-/, "").replace(/\.[^.]+$/, "").replace(/-/g, " ");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "refined-gallery",
				role: "region",
				"aria-roledescription": "carousel",
				"aria-label": "Fish, catch, refine and cook photo story",
				tabindex: "0"
			}, _attrs))}><button class="refined-gallery__arrow refined-gallery__arrow--previous" type="button" aria-label="Previous refined photo"><span aria-hidden="true">←</span></button><div class="refined-gallery__stage"><figure class="refined-gallery__figure"><p class="eyebrow refined-gallery__caption">${ssrInterpolate(unref(activeCaption))}</p>`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				class: "refined-gallery__image",
				src: unref(activeImage).src,
				alt: unref(activeImage).alt,
				width: "1600",
				height: "1067",
				sizes: "(max-width: 760px) 92vw, 1200px",
				loading: "lazy"
			}, null, _parent));
			_push(`<figcaption>${ssrInterpolate(String(unref(activeIndex) + 1).padStart(2, "0"))} / ${ssrInterpolate(String(__props.images.length).padStart(2, "0"))}</figcaption></figure><div class="refined-gallery__dots" aria-label="Choose a photo"><!--[-->`);
			ssrRenderList(__props.images, (image, index) => {
				_push(`<button type="button" class="${ssrRenderClass({ "is-active": index === unref(activeIndex) })}"${ssrRenderAttr("aria-label", `Show refined photo ${index + 1}`)}${ssrRenderAttr("aria-current", index === unref(activeIndex) ? "true" : void 0)}></button>`);
			});
			_push(`<!--]--></div></div><button class="refined-gallery__arrow refined-gallery__arrow--next" type="button" aria-label="Next refined photo"><span aria-hidden="true">→</span></button></div>`);
		};
	}
});
//#endregion
//#region components/RefinedGallery.vue
var _sfc_setup$3 = RefinedGallery_vue_vue_type_script_setup_true_lang_default.setup;
RefinedGallery_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RefinedGallery.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var RefinedGallery_default = Object.assign(RefinedGallery_vue_vue_type_script_setup_true_lang_default, { __name: "RefinedGallery" });
//#endregion
//#region data/site.ts
var site = {
	name: "Henrik Javen",
	title: "River to Table",
	description: "A personal food story shaped by patient days on the river, respect for ingredients, and the pleasure of cooking for others.",
	email: "mailto:hello@example.com",
	instagram: "",
	story: ["For me, cooking begins long before the kitchen. It begins outdoors—with attention, patience, and a deep respect for where every ingredient comes from.", "River to Table is my record of that journey: the catch, the craft, and the simple pleasure of turning something carefully gathered into food worth sharing."],
	application: "I am applying to MasterChef to test my instincts, learn at full speed, and show how an honest connection to ingredients can become memorable food.",
	gallery: [
		{
			src: "/images/video-poster.jpg",
			alt: "River to table story preview",
			title: "River to table",
			captions: {
				original: "A patient journey from the river to the table.",
				alternate: "The river, the catch, and the cooking that follows.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/river-at-sunset.jpg",
			alt: "A dog watching the sunset beneath an arched bridge by the river",
			title: "Where it begins",
			captions: {
				original: "Evenings by the river are part patience, part possibility.",
				alternate: "Sunset under the bridge — a familiar stop after a day on the water.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/cured-salmon.jpg",
			alt: "Home-cured salmon being sliced beside crispbread",
			title: "Care in the details",
			captions: {
				original: "A simple cure lets the character of the fish stay at the centre.",
				alternate: "Home-cured salmon with dill, salt, and crispbread.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/catch-1346.jpg",
			alt: "Two women smiling from a boat on a mountain lake",
			title: "On the water",
			captions: {
				original: "The day starts with good company and an open horizon.",
				alternate: "Out on the lake with the landing net ready.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/kitchen-2620.jpg",
			alt: "A kitchen counter covered in home-grown tomatoes and courgettes",
			title: "A generous harvest",
			captions: {
				original: "Cook what is abundant, ripe, and good right now.",
				alternate: "Tomatoes and squash from our Pacific Northwest garden.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/river-2687.jpg",
			alt: "A dog relaxing beside a fire on a terrace overlooking the water",
			title: "At day’s end",
			captions: {
				original: "The best days outdoors deserve an unhurried finish.",
				alternate: "Deck overlooking the water at dusk.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/table-3007.jpg",
			alt: "Friends and a dog enjoying a sunny day in a fishing boat",
			title: "Shared adventure",
			captions: {
				original: "The memories around a meal begin long before the table.",
				alternate: "Fishing day with family — rod, cooler, and dog on board.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/catch-3092.jpg",
			alt: "A flower-decorated campsite and small trailer in the forest",
			title: "A kitchen anywhere",
			captions: {
				original: "Good food can begin in even the smallest kitchen.",
				alternate: "Camp kitchen in the woods — cooking wherever we park.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/process-3109.jpg",
			alt: "Henrik fishing with his dog on a calm forest lake",
			title: "Patience",
			captions: {
				original: "Time on the water teaches attention, calm, and instinct.",
				alternate: "Casting on a forest lake with my fishing partner.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/plating-3164.jpg",
			alt: "Two whole smoked trout served with lemon and greens",
			title: "Fire and smoke",
			captions: {
				original: "A whole fish, gently smoked, needs very little else.",
				alternate: "Whole smoked trout with lemon and scallions.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/river-3309.jpg",
			alt: "Henrik holding up a small freshly caught fish on the beach",
			title: "The catch",
			captions: {
				original: "Every catch is a reason to stay curious.",
				alternate: "Fresh catch from the surf, still on the line.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/kitchen-3343.jpg",
			alt: "Several freshly caught surfperch arranged on a white plate",
			title: "From the surf",
			captions: {
				original: "Respect for the ingredient starts the moment it leaves the water.",
				alternate: "Cleaned surfperch, ready for the pan.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/table-3348.jpg",
			alt: "Fishing rods and a landing net at the bow of a boat on calm water",
			title: "Ready",
			captions: {
				original: "Preparation makes room for the unexpected.",
				alternate: "Net and rods at the bow on a calm morning.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/dish-3401.jpg",
			alt: "Fresh trout and a large salmon fillet prepared on a kitchen counter",
			title: "The ingredient",
			captions: {
				original: "Handle it carefully and let quality lead the way.",
				alternate: "Trout and salmon fillet — most of what I cook, I catch.",
				custom: "",
				agentInstructions: ""
			}
		},
		{
			src: "/images/dish-3421.jpg",
			alt: "Sunset reflected in the water behind a fishing boat",
			title: "Return",
			captions: {
				original: "Another day on the water, another story to bring home.",
				alternate: "Heading in as the sun drops behind the hills.",
				custom: "",
				agentInstructions: ""
			}
		}
	],
	refinedGallery: [
		{
			src: "/images/new-photos/every-piece-refined/00-Columbia-River.JPEG",
			alt: "A fresh salmon resting in a landing net"
		},
		{
			src: "/images/new-photos/every-piece-refined/1-Spring-Chinook-Salmon.jpeg",
			alt: "A spring Chinook salmon"
		},
		{
			src: "/images/new-photos/every-piece-refined/2-Columbia-River-Catch.jpeg",
			alt: "A Columbia River catch"
		},
		{
			src: "/images/new-photos/every-piece-refined/3-Ready-to-fillet.jpeg",
			alt: "A salmon ready to be filleted"
		},
		{
			src: "/images/new-photos/every-piece-refined/5-Perfectly-Smoked.jpg",
			alt: "A perfectly smoked salmon"
		},
		{
			src: "/images/new-photos/every-piece-refined/55-Smoked-salmon-portions.jpg",
			alt: "Portions of smoked salmon"
		},
		{
			src: "/images/new-photos/every-piece-refined/6-Scandinavian-Style-Cured-Gravlax.jpeg",
			alt: "Scandinavian style cured salmon gravlax"
		},
		{
			src: "/images/new-photos/every-piece-refined/9-Fresh-Salmon-Broth-Risotto.jpeg",
			alt: "Fresh salmon broth risotto"
		},
		{
			src: "/images/new-photos/every-piece-refined/12-Salmon-Crepes-with-crispy-gravlax-skin.JPEG",
			alt: "Salmon crepes with crispy gravlax skin"
		},
		{
			src: "/images/new-photos/every-piece-refined/7-Hot-Smoked-Salmon-Liver.jpeg",
			alt: "Hot smoked salmon liver"
		},
		{
			src: "/images/new-photos/every-piece-refined/11-Crispy-skin-tails.jpg",
			alt: "Crispy salmon skin tails"
		},
		{
			src: "/images/new-photos/every-piece-refined/8-Salmon-Roe.jpg",
			alt: "Fresh salmon roe"
		},
		{
			src: "/images/new-photos/every-piece-refined/salmon-scraps.JPEG",
			alt: "Salmon scraps ready to be used"
		},
		{
			src: "/images/new-photos/every-piece-refined/10-Tomato-and-Leek-based-Salmon-Chowder.jpg",
			alt: "Tomato and leek salmon chowder"
		}
	]
};
//#endregion
//#region app.vue?vue&type=script&setup=true&lang.ts
var canonicalUrl = "https://example.netlify.app";
var app_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: `${site.name} — ${site.title}`,
			description: site.description,
			ogTitle: `${site.name} — ${site.title}`,
			ogDescription: site.description,
			ogImage: `${canonicalUrl}/images/social-preview.jpg`,
			ogType: "website",
			ogUrl: canonicalUrl,
			twitterCard: "summary_large_image"
		});
		useHead$1({
			link: [{
				rel: "canonical",
				href: canonicalUrl
			}],
			script: [{
				type: "application/ld+json",
				innerHTML: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "ProfilePage",
					name: `${site.name} — ${site.title}`,
					description: site.description,
					mainEntity: {
						"@type": "Person",
						name: site.name,
						knowsAbout: [
							"Cooking",
							"Fishing",
							"River-to-table food"
						]
					}
				})
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			const _component_PhotoGallery = PhotoGallery_default;
			const _component_RefinedGallery = RefinedGallery_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="#" aria-label="River to Table, home"><span class="brand__mark" aria-hidden="true">R/T</span><span>River to Table</span></a><nav aria-label="Main navigation"><a href="#story">Story</a><a href="#gallery">Gallery</a><a href="#about">About</a></nav></header><main id="main"><section class="hero" aria-labelledby="hero-title">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				class: "hero__portrait",
				src: "/images/Fisherman-H.jpg",
				alt: "Fisherman H",
				width: "1461",
				height: "2411",
				sizes: "(max-width: 760px) 68vw, 30vw",
				preload: ""
			}, null, _parent));
			_push(`<div class="hero__content"><p class="eyebrow">A story by Fisherman-H</p><h1 id="hero-title">River<br>to Table</h1><p>${ssrInterpolate(unref(site).description)}</p><a class="button button--light" href="#story">Discover the story</a></div><span class="hero__scroll" aria-hidden="true">Scroll to follow the journey ↓</span></section><section id="story" class="section story" aria-labelledby="story-title"><div><p class="eyebrow">My philosophy</p><h2 id="story-title">The best meals begin with a boat and a story.</h2></div><div class="story__copy"><!--[-->`);
			ssrRenderList(unref(site).story, (paragraph) => {
				_push(`<p>${ssrInterpolate(paragraph)}</p>`);
			});
			_push(`<!--]--></div></section><section id="gallery" class="section section--gallery" aria-labelledby="gallery-title"><div class="section-heading"><div><p class="eyebrow">The journey</p><h2 id="gallery-title">From patience to plate.</h2></div><p>Use the arrows, swipe, or select a frame to move through the story.</p></div>`);
			_push(ssrRenderComponent(_component_PhotoGallery, { images: unref(site).gallery }, null, _parent));
			_push(`</section><section class="section section--refined" aria-labelledby="refined-title"><div class="section-heading"><div><p class="eyebrow">Nothing goes to waste</p><h2 id="refined-title">Catch, Refine, Cook and Enjoy</h2></div></div>`);
			_push(ssrRenderComponent(_component_RefinedGallery, { images: unref(site).refinedGallery }, null, _parent));
			_push(`</section><section id="about" class="section about" aria-labelledby="about-title"><div class="about__number" aria-hidden="true">25+</div><div class="about__copy"><p class="eyebrow">Why MasterChef</p><h2 id="about-title">Experience taught me how to build. Cooking taught me why.</h2><p> After more than 25 years creating for the web, I am ready to bring that same curiosity, calm under pressure, and appetite for learning into the MasterChef kitchen. </p><blockquote>“${ssrInterpolate(unref(site).application)}”</blockquote><a class="button"${ssrRenderAttr("href", unref(site).email)}>Start a conversation</a></div></section></main><footer class="site-footer"><a class="brand" href="#"><span class="brand__mark" aria-hidden="true">R/T</span><span>River to Table</span></a><p>Made with patience by ${ssrInterpolate(unref(site).name)}.</p><a href="#main">Back to top ↑</a></footer></div>`);
		};
	}
});
//#endregion
//#region app.vue
var _sfc_setup$2 = app_vue_vue_type_script_setup_true_lang_default.setup;
app_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var app_default = app_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-error-page.vue
var _sfc_main$1 = {
	__name: "nuxt-error-page",
	__ssrInlineRender: true,
	props: { error: Object },
	setup(__props) {
		const _error = __props.error;
		const status = Number(_error.statusCode || 500);
		const is404 = status === 404;
		const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
		const description = _error.message || _error.toString();
		const stack = void 0;
		const _Error404 = defineAsyncComponent(() => import('../build/error-404-gd5JcqKp.mjs'));
		const _Error = defineAsyncComponent(() => import('../build/error-500-DE5RylDA.mjs'));
		const ErrorTemplate = is404 ? _Error404 : _Error;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({
				status: unref(status),
				statusText: unref(statusText),
				statusCode: unref(status),
				statusMessage: unref(statusText),
				description: unref(description),
				stack: unref(stack)
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError$1(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { useRouter as a, useRuntimeConfig as b, useNuxtApp as c, nuxtLinkDefaults as d, encodeRoutePath as e, entry as f, navigateTo as n, resolveRouteObject as r, useHead$1 as u };
//# sourceMappingURL=entry.mjs.map
