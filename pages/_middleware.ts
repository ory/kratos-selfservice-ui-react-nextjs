import {NextRequest, NextResponse} from 'next/server';

export default (req: NextRequest) => {
    return NextResponse.next();
}
