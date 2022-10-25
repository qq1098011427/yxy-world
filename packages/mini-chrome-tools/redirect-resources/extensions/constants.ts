export const MODE = {
  ADMIN: 'admin',
  PORTAL: 'portal',
  CUSTOM: 'custom'
}
export const MODE_TEXT = {
  [MODE.ADMIN]: '后台',
  [MODE.PORTAL]: '前台',
  [MODE.CUSTOM]: '自定义'
}

export const INIT_BY_MODES = {
  [MODE.ADMIN]: [] as any[],
  [MODE.PORTAL]: [] as any[],
  [MODE.CUSTOM]: [] as any[]
}
