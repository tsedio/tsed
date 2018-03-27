
<header class="symbol-info-header"><h1 id="metadata">Metadata</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label stable" title="stable">stable</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Metadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//core/class/Metadata.ts#L0-L0">/core/class/Metadata.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> Metadata <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getOwn</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getOwnType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getReturnType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getOwnReturnType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">hasOwn</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">setParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> getTargetsFromPropertyKey<span class="token punctuation">:</span> <span class="token punctuation">(</span>metadataKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getOwnParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code>string</code>|A key used to store and retrieve metadata.
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata key on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// constructor
result = Metadata.get("custom:annotation", Example);

// property (on constructor)
result = Metadata.get("custom:annotation", Example, "staticProperty");

// property (on prototype)
result = Metadata.get("custom:annotation", Example.prototype, "property");

// method (on constructor)
result = Metadata.get("custom:annotation", Example, "staticMethod");

// method (on prototype)
result = Metadata.get("custom:annotation", Example.prototype, "method");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwn</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code>string</code>|A key used to store and retrieve metadata.
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata key on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// constructor
result = Metadata.getOwn("custom:annotation", Example);

// property (on constructor)
result = Metadata.getOwn("custom:annotation", Example, "staticProperty");

// property (on prototype)
result = Metadata.getOwn("custom:annotation", Example.prototype, "property");

// method (on constructor)
result = Metadata.getOwn("custom:annotation", Example, "staticMethod");

// method (on prototype)
result = Metadata.getOwn("custom:annotation", Example.prototype, "method");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata DESIGN_TYPE on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.getType(Example);

// property (on constructor)
result = Metadata.getType(Example, "staticProperty");

// method (on constructor)
result = Metadata.getType(Example, "staticMethod");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwnType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata DESIGN_TYPE on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.getOwnType(Example);

// property (on constructor)
result = Metadata.getOwnType(Example, "staticProperty");

// method (on constructor)
result = Metadata.getOwnType(Example, "staticMethod");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getReturnType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata DESIGN_RETURN_TYPE on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.getReturnType(Example);

// property (on constructor)
result = Metadata.getReturnType(Example, "staticProperty");

// method (on constructor)
result = Metadata.getReturnType(Example, "staticMethod");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwnReturnType</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata DESIGN_RETURN_TYPE on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.getOwnReturnType(Example);

// property (on constructor)
result = Metadata.getOwnReturnType(Example, "staticProperty");

// method (on constructor)
result = Metadata.getOwnReturnType(Example, "staticMethod");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code>string</code>|A key used to store and retrieve metadata.
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// constructor
result = Metadata.has("custom:annotation", Example);

// property (on constructor)
result = Metadata.has("custom:annotation", Example, "staticProperty");

// property (on prototype)
result = Metadata.has("custom:annotation", Example.prototype, "property");

// method (on constructor)
result = Metadata.has("custom:annotation", Example, "staticMethod");

// method (on prototype)
result = Metadata.has("custom:annotation", Example.prototype, "method");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">hasOwn</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code>string</code>|A key used to store and retrieve metadata.
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// constructor
result = Metadata.has("custom:annotation", Example);

// property (on constructor)
result = Metadata.hasOwn("custom:annotation", Example, "staticProperty");

// property (on prototype)
result = Metadata.hasOwn("custom:annotation", Example.prototype, "property");

// method (on constructor)
result = Metadata.hasOwn("custom:annotation", Example, "staticMethod");

// method (on prototype)
result = Metadata.hasOwn("custom:annotation", Example.prototype, "method");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code>string</code>|A key used to store and retrieve metadata.
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Deletes the metadata entry from the target object with the provided key.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// constructor
result = Metadata.delete("custom:annotation", Example);

// property (on constructor)
result = Metadata.delete("custom:annotation", Example, "staticProperty");

// property (on prototype)
result = Metadata.delete("custom:annotation", Example.prototype, "property");

// method (on constructor)
result = Metadata.delete("custom:annotation", Example, "staticMethod");

// method (on prototype)
result = Metadata.delete("custom:annotation", Example.prototype, "method");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">setParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|The property key for the target.
 value|<code>any</code>|A value that contains attached metadata.





Set the metadata value for the provided metadata DESIGN_PARAM_TYPES on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.setParamTypes(Example, undefined, [Object]);

// property (on constructor)
result = Metadata.setParamTypes(Example, "staticProperty", [Object]);

// property (on prototype)
result = Metadata.setParamTypes(Example.prototype, "property", [Object]);

// method (on constructor)
result = Metadata.setParamTypes(Example, "staticMethod", [Object]);

// method (on prototype)
result = Metadata.setParamTypes(Example.prototype, "method", [Object]);
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> getTargetsFromPropertyKey<span class="token punctuation">:</span> <span class="token punctuation">(</span>metadataKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>


Get all metadata for a metadataKey.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code>string</code>|A key used to store and retrieve metadata.
 value|<code>any</code>|A value that contains attached metadata.
 target|<code>any</code>|The target object on which to define metadata.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Define a unique metadata entry on the target.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// constructor
Reflect.defineMetadata("custom:annotation", options, Example);

// property (on constructor)
Reflect.defineMetadata("custom:annotation", Number, Example, "staticProperty");

// property (on prototype)
Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "property");

// method (on constructor)
Reflect.defineMetadata("custom:annotation", Number, Example, "staticMethod");

// method (on prototype)
Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "method");

// decorator factory as metadata-producing annotation.
function MyAnnotation(options): PropertyDecorator {
    return (target, key) => Reflect.defineMetadata("custom:annotation", options, target, key);
}
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata DESIGN_PARAM_TYPES on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.getParamTypes(Example);

// property (on constructor)
result = Metadata.getParamTypes(Example, "staticProperty");

// method (on constructor)
result = Metadata.getParamTypes(Example, "staticMethod");
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwnParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The target object on which the metadata is defined.
 propertyKey|<code>string &#124; symbol</code>|Optional. The property key for the target.





Gets the metadata value for the provided metadata DESIGN_PARAM_TYPES on the target object or its prototype chain.

```typescript
class Example {
    // property declarations are not part of ES6, though they are valid in TypeScript:
    // static staticProperty;
    // property;

    static staticMethod(p) { }
    method(p) { }
}

// on contructor
result = Metadata.getParamTypes(Example);

// property (on constructor)
result = Metadata.getParamTypes(Example, "staticProperty");

// method (on constructor)
result = Metadata.getParamTypes(Example, "staticMethod");
```








