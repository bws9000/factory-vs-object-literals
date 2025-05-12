export type Employee = {
    id: number;
    name: string;
    email: string;
    department: string;
};

/*possible bad idea, better for known types or internal use only
(ex: internal form models or patch updates where safety is already controlled)*/
export function createEmployeeV1(data: Partial<Employee>): Employee {
    if (!data.id || !data.name || !data.email || !data.department) {
        throw new Error('Invalid Employee data');
    }
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        department: data.department
    };
}


/* possible bad idea, manually defining a loose object shape
(good only for very simple, controlled internal structures -not safe for API or external data)*/
export function createEmployeeV2(data: { id?: number | null, name?: string, email?: string, department?: string }): Employee {
    if (!data.id || !data.name || !data.email || !data.department) {
        throw new Error('Invalid Employee data');
    }

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        department: data.department
    };
}


//best
export function createEmployee(data: unknown): Employee {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid Employee data: not an object');
    }
    const raw = data as Record<string, unknown>;

    let idValue = raw["id"];
    let id: number | undefined;

    if (typeof idValue === 'number') {
        id = idValue;
    } else if (typeof idValue === 'string' && !isNaN(Number(idValue))) {
        id = Number(idValue);
    } else {
        id = undefined;
    }
    const name = typeof raw["name"] === 'string' && raw["name"].trim() !== ''
        ? raw["name"]
        : undefined;

    const email = typeof raw["email"] === 'string' && raw["email"].includes('@')
        ? raw["email"]
        : undefined;

    const department = typeof raw["department"] === 'string' && raw["department"].trim() !== ''
        ? raw["department"]
        : undefined;

    if (!id || !name || !email || !department) {
        throw new Error(`Invalid Employee data: ${JSON.stringify(data)}`);
    }

    return { id, name, email, department };
}

