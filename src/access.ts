/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState:
    | { currentUser?: API.CurrentUser; menuResources?: API.SysResourceVO[] }
    | undefined,
) {
  const { menuResources } = initialState ?? {};
  const buttonPermissions = new Set(
    (menuResources ?? [])
      .filter((r) => r.type === 1 && r.permission)
      .map((r) => r.permission as string),
  );
  return {
    canAccess: (permission: string) => buttonPermissions.has(permission),
  };
}
