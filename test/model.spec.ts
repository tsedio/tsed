import * as Chai from "chai";
import {Comment} from './helper/models/Event';

const expect: Chai.ExpectStatic = Chai.expect;

describe('Table/Column decorators and Model abstract class: ', () => {

    it('Comment should have table() static method', () => {
        expect(Comment.table()).to.equal("comments");
    });

    it('Comment should have mappings() static method', () => {
        expect(Comment.mappings()).to.deep.equal({id: 'id', content: '_content'});
    });

    it('Comment should have mappingsReverse() static method', () => {
        expect(Comment.mappingsReverse()).to.deep.equal({id: 'id', _content: 'content'});
    });

    it('Comment should have columns() static method', () => {
        expect(Comment.columns()).to.deep.equal(['comments.id', 'comments._content']);
    });
});