import {provide, fluentProvide, buildProviderModule} from 'inversify-binding-decorators';
import TAGS from '../contanst/tags';

const provideThrowable = (indentifier, name) => {
    return fluentProvide(indentifier)
    .whenTargetNamed(name)
    .done();
}

export {
    buildProviderModule,
    provideThrowable,
    TAGS
}
 