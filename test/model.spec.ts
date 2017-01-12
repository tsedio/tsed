import * as Chai from "chai";
import {Comment} from './helper/models/Event';

const expect: Chai.ExpectStatic = Chai.expect;

describe('Table/Column decorators and Model class: ', () => {

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
        expect(Comment.columns()).to.deep.equal(["comments.id AS 'comments.id'", "comments._content AS 'comments.content'"]);
    });

    it('Comment should have column() static method', () => {
        expect(Comment.column('content')).to.deep.equal('comments.content');
    });


    it('Comment should have fromDB() static method', () => {
        const data = {"comments.content": "<h1>Hello world</h1>", "comments.id": 1};
        expect(Comment.fromDB(data)).to.have.property('content', data['comments.content']);
        expect(Comment.fromDB(data)).to.have.property('id', data['comments.id']);
    });
});