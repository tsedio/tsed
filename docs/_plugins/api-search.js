(function () {
  "use strict";

  let INDEX = {};
  let criteria = {};

  const bindDropdown = (type) => {
    const $fieldFilterByType = Docsify.dom.find("aio-select.aio-" + type);

    if ($fieldFilterByType) {
      const $button = Docsify.dom.find($fieldFilterByType, "button");
      $button.symbolType = Docsify.dom.find($fieldFilterByType, ".symbol");
      $button.symbolLabel = Docsify.dom.find($fieldFilterByType, ".symbol-text");

      const lists = Docsify.dom.findAll($fieldFilterByType, "li");

      Docsify.dom.on($button, "click", (e) => {
        $fieldFilterByType.classList.add("open");
        $button.focus();
      });

      Docsify.dom.on($button, "blur", () => {
        setTimeout(() => $fieldFilterByType.classList.remove("open"), 200);
      });

      lists.forEach((item) => {
        Docsify.dom.on(item, "click", () => {

          lists.forEach(li => li.classList.remove("selected"));

          const value = item.dataset.value || "all";
          const label = item.dataset.label || "All";
          $button.symbolType.className = "symbol " + value;
          $button.symbolLabel.innerHTML = label;

          item.classList.add("selected");

          const obj = {};
          obj[type] = value;

          searchApi(obj);
        });
      });

    }

  };

  const bindSearchFields = () => {
    const $searchField = Docsify.dom.find(".api-search input");

    Docsify.dom.on($searchField, "keyup", () => {
      searchApi({keywords: $searchField.value});
    });
  };

  const bindEvents = () => {
    bindDropdown("type");
    bindDropdown("status");
    bindSearchFields();

    INDEX = {};

    Docsify.dom.findAll(".api-item").forEach(el => {

      const [
        module,
        symbolName,
        symbolType,
        symbolCode,
        deprecated,
        stable,
        experimental,
        isPrivate
      ] = el.dataset.symbol.split(";");

      INDEX[module] = INDEX[module] || [];

      INDEX[module].push({
        element: el,
        module,
        symbolName,
        symbolType,
        symbolCode,
        status: [
          deprecated === "true" ? "deprecated" : "",
          experimental !== "true" ? "stable" : "",
          experimental === "true" ? "experimental" : "",
          isPrivate === "true" ? "private" : "",
          isPrivate !== "true" ? "public" : ""
        ]
      });
    });
  };

  const searchApi = (options) => {

    if (options.keywords && criteria.keywords === options.keywords) {
      return;
    }

    const container = Docsify.dom.find(".plugin-api-search");
    const {type = "", status = "", keywords = ""} = Object.assign(criteria, options);

    const empty = (t) => t === "" || t === "all";
    Object.keys(INDEX).forEach((group) => {
      const groupKey = group.replace("/", "");
      const titleGroup = Docsify.dom.find(container, "#" + groupKey);

      INDEX[group].forEach((symbol) => {
        const el = symbol.element;

        el.style.display = "inline-block";
        symbol.show = true;

        if (!empty(type) && type !== symbol.symbolType) {
          el.style.display = "none";
          symbol.show = false;
          return;
        }

        if (!empty(status) && symbol.status.indexOf(status) === -1) {
          el.style.display = "none";
          symbol.show = false;
          return;
        }

        if (keywords !== "" && !symbol.symbolName.toLowerCase().match(keywords.toLowerCase())) {
          el.style.display = "none";
          symbol.show = false;
        }
      });

      if (!INDEX[group].find(symbol => symbol.show)) {
        titleGroup.style.display = "none";
        INDEX[group][0].element.parentNode.style.display = "none";
      } else {
        titleGroup.style.display = "block";
        INDEX[group][0].element.parentNode.style.display = "block";
      }

    });
  };

  const install = (hook, vm) => {
    hook.doneEach((_) => {
      if (Docsify.dom.find(".api-search input")) {
        bindEvents();

        const search = window.location.hash.split("?")[1];
        if (search) {
          const query = {};
          search.split("&").forEach(values => {
            const arg = values.split("=");
            query[arg[0]] = arg[1];
          });

          if (query.query) {
            query.query.split("%7c").forEach(values => {
              const arg = values.split("_");
              query[arg[0]] = arg[1];
            });

          }
          searchApi(query);
        }
      }
    });
  };

  $docsify.plugins = [].concat(install, $docsify.plugins);

}());