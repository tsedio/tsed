import * as Chai from "chai";
import {Comment} from './helper/models/Event';

const expect: Chai.ExpectStatic = Chai.expect;

describe('Table/Column decorators and Model class: ', () => {

    describe('table() static method', () => {

        it('should return table name', () => {
            expect(Comment.table()).to.equal('comments');
        })

    });

    describe('mappings() static method', () => {

        it('should return mappings', () => {
            expect(Comment.mappings()).to.deep.equal({id: 'id', content: '_content'});
            expect(Comment.mappings()).to.not.have.property('otherThing');
        });

    });

    describe("mappingsReverse() static method", () => {

        it('should return reversed mappings', () => {
            expect(Comment.mappingsReverse()).to.deep.equal({id: 'id', _content: 'content'});
            expect(Comment.mappings()).to.not.have.property('otherThing');
        });

    });

    describe('columns() static method', () => {

        it('should return columns without prefix', () => {
            expect(Comment.columns()).to.deep.equal(["comments.id AS 'id'", "comments._content AS '_content'"]);
        });

        it('should return columns with prefix', () => {
            expect(Comment.columns({prefix: true})).to.deep.equal(["comments.id AS 'comments.id'", "comments._content AS 'comments._content'"]);
        });
    });


    describe("column() static method", () => {

        it('should return column name without prefix', () => {
            expect(Comment.column('content')).to.deep.equal('_content');
        });

        it('should return column name with prefix', () => {
            expect(Comment.column('content', {prefix: true})).to.deep.equal('comments._content');
        });

        it('should return null with invalid property', () => {
            expect(Comment.column('invalid')).to.be.undefined;
        });

        it('should return null with invalid property and option prefix', () => {
            expect(Comment.column('invalid', {prefix: true})).to.be.undefined;
        });
    });

    describe("fromDB() static method", () => {

        it('should handle data without prefix and return instance', () => {

            const data = {_content: "<h1>Hello world</h1>", id: 1};
            expect(Comment.fromDB(data)).to.have.property('content', data._content);
            expect(Comment.fromDB(data)).to.have.property('id', data.id);

        });

        it('should handle data with prefix and return instance', () => {

            const data = {"comments._content": "<h1>Hello world</h1>", "comments.id": 1};
            expect(Comment.fromDB(data, {prefix: true})).to.have.property('content', data['comments._content']);
            expect(Comment.fromDB(data, {prefix: true})).to.have.property('id', data['comments.id']);

        });

        it('should handle other table data and return that instance', () => {

            const data = {"comments._content": "<h1>Hello world</h1>", "comments.id": 1, "users.other1": 1, "other2": 1};
            expect(Comment.fromDB(data, {prefix: true})).to.have.property('content', data['comments._content']);
            expect(Comment.fromDB(data, {prefix: true})).to.have.property('id', data['comments.id']);
            expect(Comment.fromDB(data, {prefix: true})).to.not.have.property('other1');
            expect(Comment.fromDB(data, {prefix: true})).to.not.have.property('other2');
        });
    });
});