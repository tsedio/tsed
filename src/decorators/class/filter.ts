
import FilterService from "../../services/filter";
export function Filter() {

    return (target) => {

        FilterService.set(target);

    }
}