const express = require("express");

/**
 * @deprecated Will be removed
 * @param {string | any} obj
 * @param {Function} value
 */
export function extendsRequest(obj: string | any, value?: Function | any) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach(key => {
      extendsRequest(key, obj[key]);
    });
  } else {
    Object.defineProperty(express.request, obj, typeof value === "function" ? {value} : value);
  }
}

if (!express.request.setEndpoint) {
  extendsRequest({
    /**
     * @deprecated Now context is initialised when request is received
     */
    // istanbul ignore next
    createContainer() {},
    /**
     * @deprecated  Use request.ctx.container
     */
    // istanbul ignore next
    getContainer() {
      return this.ctx.container;
    },
    /**
     * @deprecated Use request.ctx.enpoint
     * @returns {any}
     */
    // istanbul ignore next
    getEndpoint() {
      return this.ctx.endpoint;
    },
    /**
     * @deprecated Use request.ctx.data
     * @param data
     * @returns {storeData}
     */
    // istanbul ignore next
    storeData(data: any) {
      this.ctx.data = data;

      return this;
    },
    /**
     * @deprecated Use request.ctx.data
     * @returns {any}
     */
    // istanbul ignore next
    getStoredData() {
      return this.ctx.data;
    }
  });
}
