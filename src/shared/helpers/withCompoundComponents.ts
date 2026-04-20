type CompoundComponent<TRoot extends object, TParts extends object> = TParts & TRoot;

export function withCompoundComponents<TRoot extends object, TParts extends object>(
 root: TRoot,
 parts: TParts,
): CompoundComponent<TRoot, TParts> {
 return Object.assign(root, parts);
}
