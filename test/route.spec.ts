import {expect} from "chai";
import {inject} from './.';
import {RouteService} from '../src';
import {$log} from "ts-log-debug";

describe('RouteService :', function() {

    it('should inject RouteService and return routes', inject([RouteService], (routeService: RouteService) =>{

        const routes = routeService.getAll();

        expect(routes).to.be.an('array');

    }));

    it('should inject RouteService and print routes', inject([RouteService], (routeService: RouteService) =>{
        let str = '';

        const routes = routeService.printRoutes({
            info: (...args) => (str+= args.join(' '))
        });

        expect(!!str).to.be.true;

    }));

    it('should inject RouteService and print routes', inject([RouteService], (routeService: RouteService) =>{

        $log.setRepporting({
            debug: false,
            info: false
        });

        routeService.printRoutes();

    }));
});