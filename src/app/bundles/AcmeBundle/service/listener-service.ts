/**
 * A service used to listen to events.
 */
 import { Service, Listen } from '@lyrics/annotation';
 import { BaseService }     from '@lyrics/component';

@Service('listener.service')
export class ListenerService extends BaseService
{
    constructor()
    {
        super();
    }

    @Listen('comment.posted')
    onCommentPosted(e)
    {
        console.log('Event received: comment posted!', e);
    }
}
