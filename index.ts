import Vue from './VueForServer'
import { useOutsidePromise } from 'use-outside-promise'
export interface IAsyncVueInstance {
    $createdPromise: Promise<any>
    [x: string | number | symbol]: unknown
}
type AsyncVue = (options: any) => IAsyncVueInstance
export const asyncVue: AsyncVue = options => {
    const originCreated = options.created
    const originCreatedCopy = { ...originCreated }
    const isAsyncOriginCreated =
        originCreated && originCreated.constructor.name == 'AsyncFunction'

    originCreatedCopy.created = function (this: any) {
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

    const instance: IAsyncVueInstance = new Vue(originCreatedCopy)
    return instance
}
export { Vue }
