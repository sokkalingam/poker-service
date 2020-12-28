import _ from "lodash"

export class EnumUtils {

    public static getKeys(enumVar): Array<any> {
        return Object.values(enumVar).filter((item) => isNaN(Number(item)))
    }

    public static getNumberValues(enumVar): Array<any> {
        return Object.values(enumVar).filter((item) => !isNaN(Number(item)))
    }

}