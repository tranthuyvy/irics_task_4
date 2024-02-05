import dataService from '~/services/dataService'
import { CheckSpecialInputCharacter } from '~/services/CheckData'
export const checkInputCreateGR = async (type, name, memberIds) => {// check Input createGR

    //check special input Type gr || return true if does not exist special input
    const checktypeCreateGR = async (type) => await type == 1 || type == 2 ? true : false
  
    //check special input Name gr  || return true if does not exist special input
    const checkNameGr = (name) => CheckSpecialInputCharacter(name)
  
    return await checkMembersFunc(memberIds) == true && await checktypeCreateGR(type) == true && checkNameGr(name) == false ? true : false
}

export const checkMembersFunc = async (memberIds) => {
  const checkMembers = async (memberIds) => {
    const checkSpecialInput = (memberIds) => {
      let check = true
      for (let index = 0; index < memberIds.length; index++) {
        let CheckSpecial = CheckSpecialInputCharacter(memberIds[index])
        if (CheckSpecial == true) {
          check = false
          break
        }
        else check = true
      }
      return check
    }

    if (checkSpecialInput(memberIds) == true) {
      const checkExsitMember = async (memberIds) => {
        let ExsitMember = true
        for (let index = 0; index < memberIds.length; index++) {
          if (await dataService.findUserByID(memberIds[index]) == undefined) {
            ExsitMember = false
            break
          }
          else
            ExsitMember = true
        }
        return ExsitMember
      }
      return checkExsitMember(memberIds)
    }
    else return false
  }
  return checkMembers(memberIds)
}