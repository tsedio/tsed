---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation OpenApiModelSchemaBuilder class
---
# OpenApiModelSchemaBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiModelSchemaBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/src/class/OpenApiModelSchemaBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/class/OpenApiModelSchemaBuilder.ts#L0-L0">/packages/swagger/src/class/OpenApiModelSchemaBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiModelSchemaBuilder <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiDefinitions.html"><span class="token">OpenApiDefinitions</span></a><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiResponses.html"><span class="token">OpenApiResponses</span></a><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="/api/core/class/Storable.html"><span class="token">Storable</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">getClassSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> definitions<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiDefinitions.html"><span class="token">OpenApiDefinitions</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> responses<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiResponses.html"><span class="token">OpenApiResponses</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Build a Schema from a given Model.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiDefinitions.html"><span class="token">OpenApiDefinitions</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiResponses.html"><span class="token">OpenApiResponses</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>

</div>



Build the Schema and his properties.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="/api/core/class/Storable.html"><span class="token">Storable</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">getClassSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a></code></pre>

</div>



Return the stored Schema of the class if exists. Otherwise, return an empty Schema.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> definitions<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiDefinitions.html"><span class="token">OpenApiDefinitions</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> responses<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiResponses.html"><span class="token">OpenApiResponses</span></a></code></pre>

</div>



:::