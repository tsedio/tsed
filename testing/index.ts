
import InjectorService from '../src/services/injector';

export function provide() {

}

export function inject(targets: any[], func: Function) {

    const args = targets.map((target) => {

        if(!InjectorService.has(target)){
            InjectorService.construct(target);
        }

        return InjectorService.get(target);
    });

    return func.apply(null, args);
}