import Vue from './VueForServer'
import { useOutsidePromise } from 'use-outside-promise'
export interface IAsyncVueInstance {
    $createdPromise: Promise<any>
    [x: string | number | symbol]: unknown
}
type AsyncVue = (options: any) => IAsyncVueInstance
export const asyncVue: AsyncVue = options => {
    const optionsCopy = { ...options }
    const originCreated = optionsCopy.created
    const isAsyncOriginCreated =
        originCreated && originCreated.constructor.name == 'AsyncFunction'
    optionsCopy.created = function (this: any) {
        if (isAsyncOriginCreated) {
            const outsidePromise = useOutsidePromise()
            this.$createdPromise = outsidePromise
            originCreated.call(this).then(() => {
                outsidePromise.resolve(this)
            })
            return
        }
        if (originCreated) {
            originCreated.call(this)
        }
        this.$createdPromise = Promise.resolve(this)
        return
    }

    const instance: IAsyncVueInstance = new Vue(optionsCopy)
    return instance
}
export { Vue }
