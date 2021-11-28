
export class AppUtils {

    public static statuses: string[] = [
        'completed', 'delivered', 'work in progress', 'not yet started', 'need discussion', 'cancelled'
    ];

    public static itemTypes: any[] = [
        'normal blouse', 'lining blouse', 'model blouse', 'muggum blouse'
    ];

    public static getTrimmedObj(obj: any) {
        const newObj = {} as any;
        const keys = Object.keys(obj);
        for (const key of keys) {
            try {
                newObj[key] = obj[key].trim();
            } catch {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }

}

