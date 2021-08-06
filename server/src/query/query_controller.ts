import { add_query_ownership_clauses, OwnershipPaths } from './query_ownership'

/*
Why do we need this?

Ideally, these would be auto-generated from the database schema. Unfortunately, prisma decided to use a proprietary, 
non-parsable (as in there are no utilities that I know of to parse it) format to store their database schema, 
instead of using an accepted standard such as JSON, YAML or XML. So these need to be hand-written and maintained alongside of
the database schema.


Why are there lots of similar keys?

Different keys are used in different situations. For example, goals gets multiple goals, Goal is to get one goal 
(unless we change the capital in the schema definition) and goal is used in the url params (since it is prisma.goal)


How does this work?

Each ownership path should be a list of acnestors (as in each item is a foreign key reference of the previous item), with the
last item being 'User' (unless its the Users table as a key, then the path is empty)

*/
const ownership_paths: OwnershipPaths = {
    User: [],
    users: [],
    user: [],
    Value: ['User'],
    values: ['User'],
    value: ['User'],
    Goal: ['User'],
    goals: ['User'],
    goal: ['User'],
    Behaviour: ['Goal', 'User'],
    behaviours: ['Goal', 'User'],
    behaviour: ['Goal', 'User'],
    BehaviourEvent: ['Behaviour', 'Goal', 'User'],
    behaviourEvents: ['Behaviour', 'Goal', 'User'],
    behaviourEvent: ['Behaviour', 'Goal', 'User'],
}

export const get_prisma_query = (prisma_query: any, root_table: string, username: string) => {
    return add_query_ownership_clauses(root_table, ownership_paths, 'username', [username], prisma_query)
}