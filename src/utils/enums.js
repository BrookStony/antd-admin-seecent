const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}

const Permission = {
  SHOW: 1,
  CREATE: 2,
  UPDATE: 3,
  DELETE: 4,
  SHARE: 5,
  UPLOAD: 6,
  DOWNLOAD: 7,
  CHANGE_STATUS: 8
}

const Operation = {
  SHOW: '1',
  CREATE: '2',
  UPDATE: '3',
  DELETE: '4',
  SHARE: '5',
  UPLOAD: '6',
  DOWNLOAD: '7',
  CHANGE_STATUS: '8'
}

module.exports = {
  EnumRoleType,
  Permission,
  Operation
}
