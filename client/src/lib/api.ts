async function processResponse<T>(response: Response): Promise<T> {
    const body = await response.json();
    if (response.status >= 400) {
        throw new Error(body.message)
    }

    return body
}

type Session = {
    sessionId: string
}

export async function createSession(url: string): Promise<Session> {
    return processResponse(await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({url})
    }))
}

export type Result = {
    columns?: string[],
    data?: string[][]
}

export async function executeSql(sessionId: string, sql: string): Promise<Result> {
    return processResponse(await fetch(`/api/session/${sessionId}/execute`, {
        method: "POST",
        body: JSON.stringify({sql})
    }));
}
