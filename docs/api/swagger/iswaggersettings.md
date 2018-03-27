
<header class="symbol-info-header"><h1 id="iswaggersettings">ISwaggerSettings</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ISwaggerSettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/interfaces/ISwaggerSettings.ts#L0-L0">/swagger/interfaces/ISwaggerSettings.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> ISwaggerSettings <span class="token punctuation">{</span>
    path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    cssPath?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    showExplorer?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    specPath?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    spec?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        swagger?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        info?<span class="token punctuation">:</span> Info<span class="token punctuation">;</span>
        externalDocs?<span class="token punctuation">:</span> ExternalDocs<span class="token punctuation">;</span>
        host?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        basePath?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        schemes?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        consumes?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        produces?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        paths?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token punctuation">[</span>pathName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Path<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        definitions?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token punctuation">[</span>definitionsName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        parameters?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token punctuation">[</span>parameterName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> BodyParameter | QueryParameter<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        responses?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token punctuation">[</span>responseName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        security?<span class="token punctuation">:</span> Array<<span class="token punctuation">{</span>
            <span class="token punctuation">[</span>securityDefinitionName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>><span class="token punctuation">;</span>
        securityDefinitions?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token punctuation">[</span>securityDefinitionName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/swagger/security"><span class="token">Security</span></a><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        tags?<span class="token punctuation">:</span> Tag<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">path<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">cssPath?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">options?<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">showExplorer?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">specPath?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">spec?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     swagger?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     info?<span class="token punctuation">:</span> Info<span class="token punctuation">;</span>
     externalDocs?<span class="token punctuation">:</span> ExternalDocs<span class="token punctuation">;</span>
     host?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     basePath?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     schemes?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
     consumes?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
     produces?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
     paths?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
         <span class="token punctuation">[</span>pathName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Path<span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">;</span>
     definitions?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
         <span class="token punctuation">[</span>definitionsName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">;</span>
     parameters?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
         <span class="token punctuation">[</span>parameterName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> BodyParameter | QueryParameter<span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">;</span>
     responses?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
         <span class="token punctuation">[</span>responseName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">;</span>
     security?<span class="token punctuation">:</span> Array<<span class="token punctuation">{</span>
         <span class="token punctuation">[</span>securityDefinitionName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>><span class="token punctuation">;</span>
     securityDefinitions?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
         <span class="token punctuation">[</span>securityDefinitionName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/swagger/security"><span class="token">Security</span></a><span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">;</span>
     tags?<span class="token punctuation">:</span> Tag<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
</div>








