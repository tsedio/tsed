---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation AjvService service
---
# AjvService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AjvService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/ajv/services/AjvService"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//ajv/services/AjvService.ts#L0-L0">/ajv/services/AjvService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> AjvService <span class="token keyword">extends</span> <a href="/api/common/filters/services/ValidationService.html"><span class="token">ValidationService</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> jsonSchemaService<span class="token punctuation">:</span> <a href="/api/common/jsonschema/services/JsonSchemesService.html"><span class="token">JsonSchemesService</span></a><span class="token punctuation">,</span>
    <span class="token keyword">private</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span>
    <span class="token keyword">private</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> ajvSettings<span class="token punctuation">:</span> <a href="/api/ajv/interfaces/IAjvSettings.html"><span class="token">IAjvSettings</span></a><span class="token punctuation"> = </span>this.serverSettingsService.<span class="token function">get</span><span class="token punctuation">(</span>"ajv"<span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    this.options<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>
      <span class="token punctuation">{</span>
        verbose<span class="token punctuation">:</span> false
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      ajvSettings.options || <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.errorFormatter<span class="token punctuation"> = </span>ajvSettings.errorFormat ? ajvSettings.errorFormat <span class="token punctuation">:</span> this.defaultFormatter<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">validate</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> schema<span class="token punctuation"> = </span>this.jsonSchemaService.<span class="token function">getSchemaDefinition</span><span class="token punctuation">(</span>targetType<span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>schema && !<span class="token punctuation">(</span>obj === null || obj === undefined<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> collection<span class="token punctuation"> = </span>baseType ? obj <span class="token punctuation">:</span> <span class="token punctuation">[</span>obj<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> options<span class="token punctuation"> = </span><span class="token punctuation">{</span>
        ignoreCallback<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> type === <span class="token keyword">Date</span><span class="token punctuation">,</span>
        checkRequiredValue<span class="token punctuation">:</span> false
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> test<span class="token punctuation"> = </span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> ajv<span class="token punctuation"> = </span>new <span class="token function">Ajv</span><span class="token punctuation">(</span>this.options<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">const</span> valid<span class="token punctuation"> = </span>ajv.<span class="token function">validate</span><span class="token punctuation">(</span>schema<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
        if <span class="token punctuation">(</span>!valid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          throw this.<span class="token function">buildErrors</span><span class="token punctuation">(</span>ajv.errors!<span class="token punctuation">,</span> targetType<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
      Object.<span class="token function">keys</span><span class="token punctuation">(</span>collection<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span>
        <span class="token function">test</span><span class="token punctuation">(</span>this.converterService.<span class="token function">deserialize</span><span class="token punctuation">(</span>collection<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> targetType<span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return true<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">buildErrors</span><span class="token punctuation">(</span>errors<span class="token punctuation">:</span> ErrorObject<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    $log.<span class="token function">debug</span><span class="token punctuation">(</span>"AJV errors<span class="token punctuation">:</span> "<span class="token punctuation">,</span> errors<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> message<span class="token punctuation"> = </span>errors
      .<span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">:</span> <a href="/api/ajv/interfaces/AjvErrorObject.html"><span class="token">AjvErrorObject</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        error.modelName<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>targetType<span class="token punctuation">)</span><span class="token punctuation">;</span>
        return this.errorFormatter.<span class="token function">call</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      .<span class="token function">join</span><span class="token punctuation">(</span>"\n"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return new <span class="token function"><a href="/api/ajv/errors/AjvValidationError.html"><span class="token">AjvValidationError</span></a></span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> errors<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">defaultFormatter</span><span class="token punctuation">(</span>error<span class="token punctuation">:</span> <a href="/api/ajv/interfaces/AjvErrorObject.html"><span class="token">AjvErrorObject</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> value<span class="token punctuation"> = </span>""<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>this.options.verbose<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      value<span class="token punctuation"> = </span>`<span class="token punctuation">,</span> value "$<span class="token punctuation">{</span>error.data<span class="token punctuation">}</span>"`<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return `At $<span class="token punctuation">{</span>error.modelName<span class="token punctuation">}</span>$<span class="token punctuation">{</span>error.dataPath<span class="token punctuation">}</span>$<span class="token punctuation">{</span>value<span class="token punctuation">}</span> $<span class="token punctuation">{</span>error.message<span class="token punctuation">}</span>`<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> jsonSchemaService<span class="token punctuation">:</span> <a href="/api/common/jsonschema/services/JsonSchemesService.html"><span class="token">JsonSchemesService</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token function">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> ajvSettings<span class="token punctuation">:</span> <a href="/api/ajv/interfaces/IAjvSettings.html"><span class="token">IAjvSettings</span></a><span class="token punctuation"> = </span>this.serverSettingsService.<span class="token function">get</span><span class="token punctuation">(</span>"ajv"<span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
 this.options<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>
   <span class="token punctuation">{</span>
     verbose<span class="token punctuation">:</span> false
   <span class="token punctuation">}</span><span class="token punctuation">,</span>
   ajvSettings.options || <span class="token punctuation">{</span><span class="token punctuation">}</span>
 <span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.errorFormatter<span class="token punctuation"> = </span>ajvSettings.errorFormat ? ajvSettings.errorFormat <span class="token punctuation">:</span> this.defaultFormatter<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">validate</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> schema<span class="token punctuation"> = </span>this.jsonSchemaService.<span class="token function">getSchemaDefinition</span><span class="token punctuation">(</span>targetType<span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>schema && !<span class="token punctuation">(</span>obj === null || obj === undefined<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> collection<span class="token punctuation"> = </span>baseType ? obj <span class="token punctuation">:</span> <span class="token punctuation">[</span>obj<span class="token punctuation">]</span><span class="token punctuation">;</span>
   <span class="token keyword">const</span> options<span class="token punctuation"> = </span><span class="token punctuation">{</span>
     ignoreCallback<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> type === <span class="token keyword">Date</span><span class="token punctuation">,</span>
     checkRequiredValue<span class="token punctuation">:</span> false
   <span class="token punctuation">}</span><span class="token punctuation">;</span>
   <span class="token keyword">const</span> test<span class="token punctuation"> = </span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
     <span class="token keyword">const</span> ajv<span class="token punctuation"> = </span>new <span class="token function">Ajv</span><span class="token punctuation">(</span>this.options<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token keyword">const</span> valid<span class="token punctuation"> = </span>ajv.<span class="token function">validate</span><span class="token punctuation">(</span>schema<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
     if <span class="token punctuation">(</span>!valid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       throw this.<span class="token function">buildErrors</span><span class="token punctuation">(</span>ajv.errors!<span class="token punctuation">,</span> targetType<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
   <span class="token punctuation">}</span><span class="token punctuation">;</span>
   Object.<span class="token function">keys</span><span class="token punctuation">(</span>collection<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span>
     <span class="token function">test</span><span class="token punctuation">(</span>this.converterService.<span class="token function">deserialize</span><span class="token punctuation">(</span>collection<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> targetType<span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">)</span>
   <span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return true<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">buildErrors</span><span class="token punctuation">(</span>errors<span class="token punctuation">:</span> ErrorObject<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 $log.<span class="token function">debug</span><span class="token punctuation">(</span>"AJV errors<span class="token punctuation">:</span> "<span class="token punctuation">,</span> errors<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> message<span class="token punctuation"> = </span>errors
   .<span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">:</span> <a href="/api/ajv/interfaces/AjvErrorObject.html"><span class="token">AjvErrorObject</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
     error.modelName<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>targetType<span class="token punctuation">)</span><span class="token punctuation">;</span>
     return this.errorFormatter.<span class="token function">call</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span><span class="token punctuation">)</span>
   .<span class="token function">join</span><span class="token punctuation">(</span>"\n"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return new <span class="token function"><a href="/api/ajv/errors/AjvValidationError.html"><span class="token">AjvValidationError</span></a></span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> errors<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">defaultFormatter</span><span class="token punctuation">(</span>error<span class="token punctuation">:</span> <a href="/api/ajv/interfaces/AjvErrorObject.html"><span class="token">AjvErrorObject</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">let</span> value<span class="token punctuation"> = </span>""<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>this.options.verbose<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   value<span class="token punctuation"> = </span>`<span class="token punctuation">,</span> value "$<span class="token punctuation">{</span>error.data<span class="token punctuation">}</span>"`<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return `At $<span class="token punctuation">{</span>error.modelName<span class="token punctuation">}</span>$<span class="token punctuation">{</span>error.dataPath<span class="token punctuation">}</span>$<span class="token punctuation">{</span>value<span class="token punctuation">}</span> $<span class="token punctuation">{</span>error.message<span class="token punctuation">}</span>`<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::