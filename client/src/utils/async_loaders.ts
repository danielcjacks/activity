import { runInAction } from 'mobx'


// generates a key or the _loader object based on a function call
const get_loader_key = (function_name, args) =>
    `${function_name}/${args.map(el => JSON.stringify(el)).join('#')}`

const loader_function_matches_key = (function_name, args, key) => {
    // split key into args and function name
    // check that function name matches
    // check that each arg matches. undefined args are like wildcards - everything matches it

    const [key_function_name, key_args_string] = key.split('/')
    const key_args = key_args_string.split('#')
    
    const function_name_matches = function_name === key_function_name
    const args_match = key_args
        .map((key_arg, i) => 
            args[i] === undefined || key_arg === JSON.stringify(args[i])
        )
        .every(does_match => does_match === true)

    return function_name_matches && args_match
} 

// utility function to make it easier to get loader state for a class instance.
// Note the ...args are spread. So this should be called like 
//      get_loader_for_class_instance(my_class, my_class.func, 'argument1', 3, 'argument2')
// or
//      get_loader_for_class_instance(my_class, my_class.func, ...args)
export const get_loading = (class_instance, class_function, ...args) => {
    const function_name = class_function.name
    
    for (const loader_key of Object.keys(class_instance._loaders)) {
        if (loader_function_matches_key(function_name, args, loader_key)) {
            return class_instance._loaders[loader_key]
        }
    }

    return undefined
}

// This sets up loading trackers for all functions in a class instance that are async or return a promise.
//
// Takes a class instance and modified its properties. Any properties that are functions are wrapped in a loader wrapper.
// The loader wrapper does nothing for functions that return regular values. If a function returns a promise, 
// it sets a _loader key to true in the class instance, then deletes it once the promise resolves or rejects
export const setup_async_loaders = (class_instance) => {
    // instantiate loaders if it doesnt exist
    if (class_instance._loaders === undefined) {
        class_instance._loaders = {}
    }

    const prop_names = Object.getOwnPropertyNames(class_instance)

    for (const prop_name of prop_names) {
        const prop = class_instance[prop_name]

        if (prop instanceof Function) {
            // wrap the function prop in a loader setter
            const wrapped_function = (...args) => {
                // to determine if it's async (could return a promise, but not be marked async), we check for a .then property of the return value
                const function_return = prop(...args)
                const did_return_promise = function_return != null && typeof function_return.then === 'function'

                if (did_return_promise) {
                    // now set loading to true and delete it once the promise resolves or fails
                    try {
                        const loader_key = get_loader_key(prop_name, args)
                        class_instance._loaders[loader_key] = true
                        return function_return.then(val => {
                            runInAction(() => {
                                delete class_instance._loaders[loader_key]
                            })
                            return val
                        }).catch(err => {
                            runInAction(() => {
                                delete class_instance._loaders[loader_key]
                            })
                            return err
                        })
                    } catch (error) {
                        console.error('There was a problem stringifying function args. Async loaders are disabled for this function.', {
                            error,
                            function_name: prop_name
                        })
                        return function_return
                    }

                } else {
                    return function_return
                }
            }

            Object.defineProperty(wrapped_function, "name", { value: prop.name }) // copy the function name to allow us to later figure out which function this is wrapping

            class_instance[prop_name] = wrapped_function
        }
    }
}