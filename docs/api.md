---
layout: page
meta:
  - name: description
    content: Api Reference of Ts.ED. Use decorator to build your model and map data.
  - name: keywords
    content: api reference model decorators ts.ed express typescript node.js javascript jsonschema json mapper serialization deserialization
---

<script setup>
import {data} from './api.data';
</script>

<Api :modules="data.modules" :symbol-types="data.symbolTypes"  />
