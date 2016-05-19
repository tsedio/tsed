import Promise = require("bluebird");
import express = require("express");

interface IExpressRouter {
    stack?: IExpressLayer[];
    $methodClassName?: string;
}

interface IExpressLayer{
    handle: IExpressRouter;
    name: string;
    params: any;
    path: any;
    keys: any[];
    regexp: RegExp;
    route: any;
}
