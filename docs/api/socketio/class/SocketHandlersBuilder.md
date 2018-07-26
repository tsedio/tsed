---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketHandlersBuilder class
---
# SocketHandlersBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketHandlersBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio/class/SocketHandlersBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//socketio/class/SocketHandlersBuilder.ts#L0-L0">/socketio/class/SocketHandlersBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SocketHandlersBuilder <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token keyword">private</span> provider<span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> <span class="token keyword">private</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a><span class="token punctuation">,</span> <span class="token keyword">private</span> injector<span class="token punctuation">:</span> <a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.socketProviderMetadata<span class="token punctuation"> = </span>this.provider.store.<span class="token function">get</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">build</span><span class="token punctuation">(</span>nsps<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> SocketIO.Namespace&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>instance<span class="token punctuation">}</span><span class="token punctuation"> = </span>this.provider<span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>injectNamespaces<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> namespace<span class="token punctuation"> = </span>"/"<span class="token punctuation">}</span><span class="token punctuation"> = </span>this.socketProviderMetadata<span class="token punctuation">;</span>
    <span class="token keyword">const</span> nsp<span class="token punctuation"> = </span>nsps.<span class="token function">get</span><span class="token punctuation">(</span>namespace<span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>instance.$onConnection<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.<span class="token function">buildHook</span><span class="token punctuation">(</span>"$onConnection"<span class="token punctuation">,</span> "connection"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>instance.$onDisconnect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.<span class="token function">buildHook</span><span class="token punctuation">(</span>"$onDisconnect"<span class="token punctuation">,</span> "disconnect"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    instance._nspSession<span class="token punctuation"> = </span><span class="token function">getNspSession</span><span class="token punctuation">(</span>namespace!<span class="token punctuation">)</span><span class="token punctuation">;</span>
    injectNamespaces.<span class="token function">forEach</span><span class="token punctuation">(</span>setting =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      instance<span class="token punctuation">[</span>setting.propertyKey<span class="token punctuation">]</span><span class="token punctuation"> = </span>nsps.<span class="token function">get</span><span class="token punctuation">(</span>setting.nsp || namespace<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    instance<span class="token punctuation">[</span>"nsp"<span class="token punctuation">]</span><span class="token punctuation"> = </span>nsp<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>instance.$onNamespaceInit<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      instance.$<span class="token function">onNamespaceInit</span><span class="token punctuation">(</span>nsp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">buildHook</span><span class="token punctuation">(</span>hook<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> handlers<span class="token punctuation"> = </span>this.socketProviderMetadata.handlers || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    handlers<span class="token punctuation">[</span>hook<span class="token punctuation">]</span><span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>handlers<span class="token punctuation">[</span>hook<span class="token punctuation">]</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      eventName<span class="token punctuation">,</span>
      methodClassName<span class="token punctuation">:</span> hook
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.socketProviderMetadata.handlers<span class="token punctuation"> = </span>handlers<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">build</span><span class="token punctuation">(</span>nsps<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> SocketIO.Namespace&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> <span class="token punctuation">{</span>instance<span class="token punctuation">}</span><span class="token punctuation"> = </span>this.provider<span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token punctuation">{</span>injectNamespaces<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> namespace<span class="token punctuation"> = </span>"/"<span class="token punctuation">}</span><span class="token punctuation"> = </span>this.socketProviderMetadata<span class="token punctuation">;</span>
 <span class="token keyword">const</span> nsp<span class="token punctuation"> = </span>nsps.<span class="token function">get</span><span class="token punctuation">(</span>namespace<span class="token punctuation">)</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>instance.$onConnection<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this.<span class="token function">buildHook</span><span class="token punctuation">(</span>"$onConnection"<span class="token punctuation">,</span> "connection"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span>instance.$onDisconnect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this.<span class="token function">buildHook</span><span class="token punctuation">(</span>"$onDisconnect"<span class="token punctuation">,</span> "disconnect"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 instance._nspSession<span class="token punctuation"> = </span><span class="token function">getNspSession</span><span class="token punctuation">(</span>namespace!<span class="token punctuation">)</span><span class="token punctuation">;</span>
 injectNamespaces.<span class="token function">forEach</span><span class="token punctuation">(</span>setting =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   instance<span class="token punctuation">[</span>setting.propertyKey<span class="token punctuation">]</span><span class="token punctuation"> = </span>nsps.<span class="token function">get</span><span class="token punctuation">(</span>setting.nsp || namespace<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 instance<span class="token punctuation">[</span>"nsp"<span class="token punctuation">]</span><span class="token punctuation"> = </span>nsp<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>instance.$onNamespaceInit<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   instance.$<span class="token function">onNamespaceInit</span><span class="token punctuation">(</span>nsp<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">buildHook</span><span class="token punctuation">(</span>hook<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> handlers<span class="token punctuation"> = </span>this.socketProviderMetadata.handlers || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
 handlers<span class="token punctuation">[</span>hook<span class="token punctuation">]</span><span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>handlers<span class="token punctuation">[</span>hook<span class="token punctuation">]</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
   eventName<span class="token punctuation">,</span>
   methodClassName<span class="token punctuation">:</span> hook
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">this.socketProviderMetadata.handlers<span class="token punctuation"> = </span>handlers</code></pre>

</div>



:::