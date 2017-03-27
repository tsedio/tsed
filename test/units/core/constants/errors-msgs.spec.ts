/*import {expect} from "chai";
import {
    BAD_REQUEST, BAD_REQUEST_REQUIRED, CONVERTER_DESERIALIZE, CONVERTER_SERIALIZE, CYCLIC_REF,
    DUPLICATED_CONTROLLER_DECORATOR, TEMPLATE_RENDERING_ERROR, UNKNOW_CONTROLLER, UNKNOW_SERVICE
} from "../../../../src/core/constants/errors-msgs";

describe('Errors Messages : ', () => {

    it('should return messages', () => {

        expect(BAD_REQUEST_REQUIRED('cookies', 'test')).to.equal('Bad request, parameter request.cookies.test is required.');
        expect(BAD_REQUEST('cookies', 'test')).to.equal('Bad request, parameter request.cookies.test.');
        expect(DUPLICATED_CONTROLLER_DECORATOR('name')).to.equal('Cannot apply @Controller decorator multiple times (name).');
        expect(UNKNOW_CONTROLLER('name')).to.equal('Controller name not found.');
        expect(UNKNOW_SERVICE('name')).to.equal('Service name not found.');
        expect(CYCLIC_REF('ctrl1', 'ctrl2')).to.equal('Cyclic reference between ctrl1 and ctrl2.');
        expect(CONVERTER_DESERIALIZE('class', {})).to.equal('Convertion failed for class "class" with object => {}.');
        expect(CONVERTER_SERIALIZE('class', {})).to.equal('Convertion failed for class "class" with object => {}.');
        expect(TEMPLATE_RENDERING_ERROR('className', 'methodName', 'stack')).to.equal('Template rendering error : className.methodName()\nstack');

    });

 });*/