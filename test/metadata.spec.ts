import * as Chai from "chai";
import Metadata from '../src/metadata/metadata';

const expect: Chai.ExpectStatic = Chai.expect;

class Test{

    attribut;

    constructor(){}

    method(){

    }

    static methodStatic(){

    }
}

class Test2{

    attribut;

    constructor(){}

    method(){

    }

    static methodStatic(){

    }
}



describe('Metadata :', () => {


    describe('static with class', () => {

        describe('set and get metadata', () => {

            it('should set a metadata', () => {

                expect(Metadata.has('metadatakey1', Test)).to.be.false;

                expect(Metadata.set('metadatakey1', 'test1', Test)).to.equal(undefined);
                expect(Metadata.set('metadatakey2', 'test2', new Test)).to.equal(undefined);
            });

            it('should has a metadata', () => {
                expect(Metadata.has('metadatakey1', Test)).to.be.true;
            });

            it('should get a metadata', () => {
                expect(Metadata.get('metadatakey1', Test)).to.equal("test1");
                expect(Metadata.get('metadatakey2', new Test)).to.equal("test2");
                expect(Metadata.get('metadatakey1', new Test)).to.equal("test1");
                expect(Metadata.get('metadatakey2', Test)).to.equal("test2");
            });


        });

    });

    describe('static with class + method', () => {

        describe('set and get metadata', () => {

            it('should set a metadata', () => {

                expect(Metadata.has('metadatakey1', Test, 'method')).to.be.false;

                expect(Metadata.set('metadatakey1', 'test1', Test, 'method')).to.equal(undefined);
                expect(Metadata.set('metadatakey2', 'test2', new Test, 'method')).to.equal(undefined);
            });

            it('should has a metadata', () => {
                expect(Metadata.has('metadatakey1', Test, 'method')).to.be.true;
            });

            it('should get a metadata', () => {
                expect(Metadata.get('metadatakey1', Test, 'method')).to.equal("test1");
                expect(Metadata.get('metadatakey2', new Test, 'method')).to.equal("test2");
                expect(Metadata.get('metadatakey1', new Test, 'method')).to.equal("test1");
                expect(Metadata.get('metadatakey2', Test, 'method')).to.equal("test2");
            });


        });

    });

    describe('new Metadata with class', () => {

        describe('set and get metadata', () => {

            it('should set, has end get a metadata', () => {

                const metadata = new Metadata('metadata3', Test);

                expect(metadata.has()).to.be.false;
                expect(metadata.set('test3')).to.equal(undefined);

                expect(metadata.has()).to.be.true;
                expect(metadata.get()).to.equal("test3");
            });


        });

    });

    describe('new Metadata with class + method', () => {

        describe('set and get metadata', () => {

            it('should set, has end get a metadata', () => {

                const metadata = new Metadata('metadata4', Test, 'method');

                expect(metadata.has()).to.be.false;
                expect(metadata.set('test4')).to.equal(undefined);

                expect(metadata.has()).to.be.true;
                expect(metadata.get()).to.equal("test4");
            });


        });
    });

    describe('delete Metadata with class', () => {

        it('should set, has end get a metadata', () => {

            expect(Metadata.has('metadatakey8', Test)).to.be.false;
            Metadata.set('metadatakey8', 'test1', Test);

            expect(Metadata.get('metadatakey8', Test)).to.equal('test1');

            Metadata.delete(Test, 'metadatakey8');

            expect(Metadata.get('metadatakey8', Test)).to.equal(undefined);
        });

    });

    describe('list', () => {
        it('should return unique targetClass from property key', () => {

            Metadata.set('controller', 'test', Test);
            Metadata.set('controller', 'test2', Test2);
            Metadata.set('controller', 'test', Test);

            const result = Metadata.getTargetsFromPropertyKey('controller');

            expect(result).to.be.an('array');
            expect(result.length).to.equal(2);
            expect(result.indexOf(Test) > -1).to.be.true;
            expect(result.indexOf(Test2) > -1).to.be.true;

            const result2 = Metadata.getTargetsFromPropertyKey('controller2');

            expect(result2).to.be.an('array');
            expect(result2.length).to.equal(0);

        });
    });
});