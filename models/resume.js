const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const fs = require('fs').promises;
const contants = require('fs').constants;
const path = require('path');

/**
* 이력서 Model
*
*/
const resume = {
  /**
  * 이력서 저장
  *
  * @param Object params - req.body
  * @return Boolean
  */
  update : async function(params) {
    try {
      // basic info 처리
//console.log(params);
      // 취업우대 • 병역 선택 체크
      if (!params.items || params.items.indexOf("병역") == -1) { // 취업우대, 병역항목 선택이 없으면 값 비우기
        params.military = params.militaryLevel = params.benefit = "";
      }

      if (params.benefit instanceof Array) {
        params.benefit = params.benefit.join("||");
      }

      let sql = `UPDATE basicinfo
                      SET
                          resumeTitle = :resumeTitle,
                          name = :name,
                          birthDate = :birthDate,
                          landline = :landline,
                          cellPhone = :cellPhone,
                          gender = :gender,
                          email = :email,
                          address = :address,
                          workType = :workType,
                          salary = :salary,
                          workLocation = :workLocation,
                          workKeyword = :workKeyword,
                          benefit = :benefit,
                          handicapLevel = :handicapLevel,
                          military = :military,
                          militaryStartDate = :militaryStartDate,
                          militaryEndDate = :militaryEndDate,
                          militaryLevel = :militaryLevel,
                          negotiableSalary = :negotiableSalary
                          `;
      let replacements = {
        resumeTitle : params.resumeTitle,
        name : params.name,
        birthDate : params.birthDate,
        landline : params.landline,
        cellPhone : params.cellPhone,
        gender : params.gender,
        email : params.email,
        address : params.address,
        workType : params.workType,
        salary : params.salary,
        workLocation : params.workLocation,
        workKeyword : params.workKeyword,
        benefit : params.benefit || "",
        handicapLevel : params.handicapLevel,
        military : params.military,
        militaryStartDate : params.militaryStartDate,
        militaryEndDate : params.militaryEndDate,
        militaryLevel : params.militaryLevel,
        negotiableSalary : params.negotiableSalary || 0,
      };

      let result = await sequelize.query(sql, {
        replacements,
        type : QueryTypes.INSERT,
      });

      // school 학력 처리
      sql = 'TRUNCATE school';
      await sequelize.query(sql, { type : QueryTypes.DELETE });

      if (params.items && params.items.indexOf("학력") != -1) {
        if (!(params.schoolType instanceof Array)) {
          //console.log(params);
          params.schoolType = [params.schoolType];
          params.schoolName = [params.schoolName];
          params.schoolStartDate = [params.schoolStartDate];
          params.schoolEndDate = [params.schoolEndDate];
          params.schoolStatus = [params.schoolStatus];
          params.schoolTransfer = [params.schoolTransfer];
          params.schoolMajor = [params.schoolMajor];
          params.schoolGrades = [params.schoolGrades];
          params.schoolTotalScore = [params.schoolTotalScore];
        }

        params.schoolType.forEach(async (type, index) => {
          const sql = `INSERT INTO school (type, name, startDate, endDate, status, transfer, major, grades, totalScore)
                              VALUES (:type, :name, :startDate, :endDate, :status, :transfer, :major, :grades, :totalScore)`;
          const replacements = {
            type : type,
            name : params.schoolName[index],
            startDate : params.schoolStartDate[index],
            endDate : params.schoolEndDate[index],
            status : params.schoolStatus[index],
            transfer : params.schoolTransfer[index],
            major : params.schoolMajor[index],
            grades : params.schoolGrades[index],
            totalScore : params.schoolTotalScore[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // job history 경력 처리
      sql = "TRUNCATE jobhistory";
      await sequelize.query(sql, { type : QueryTypes.DELETE });
      if (params.items && params.items.indexOf("경력") != -1) {
        if(!(params.jhCompany instanceof Array)) {
          params.jhCompany = [params.jhCompany];
          params.jhDept = [params.jhDept];
          params.jhStartDate = [params.jhStartDate];
          params.jhEndDate = [params.jhEndDate];
          params.jhInOffice = [params.jhInOffice];
          params.jhPosition = [params.jhPosition];
          params.jhTask = [params.jhTask];
          params.jhSalary = [params.jhSalary];
          params.jhWork = [params.jhWork];
        }//console.log(params);

        params.jhCompany.forEach(async (company, index) => {
          const sql = `INSERT INTO jobhistory (company, dept, startDate, endDate, position, task, salary, work, inOffice)
                                      VALUES (:company, :dept, :startDate, :endDate, :position, :task, :salary, :work, :inOffice)`;
          const replacements = {
            company : company,
            dept : params.jhDept[index],
            startDate : params.jhStartDate[index],
            endDate : params.jhEndDate[index],
            position : params.jhPosition[index],
            task : params.jhTask[index],
            salary : params.jhSalary[index],
            work : params.jhWork[index],
            inOffice : 0,
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // intern 인턴 처리
      sql = 'TRUNCATE intern';
      await sequelize.query(sql, { type:QueryTypes.DELETE });
      if (params.items && params.items.indexOf("인턴") != -1) {
        if (!(params.internType instanceof Array)) {
          params.internType = [params.internType];
          params.internCompany = [params.internCompany];
          params.internStartDate = [params.internStartDate];
          params.internEndDate = [params.internEndDate];
          params.internDesc = [params.internDesc];
        }

        params.internType.forEach(async (type, index) => {
          const sql = `INSERT INTO intern (type, company, startDate, endDate, description)
                                  VALUES (:type, :company, :startDate, :endDate, :description)`;
          const replacements = {
            type : type,
            company : params.internCompany[index],
            startDate : params.internStartDate[index],
            endDate : params.internEndDate[index],
            description : params.internDesc[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // education 교육이수 처리
      sql = 'TRUNCATE education';
      await sequelize.query(sql, { type : QueryTypes.DELETE });
      if (params.items && params.items.indexOf("교육이수") != -1) {
        //console.log(params);
        if (!(params.eduName instanceof Array)) {
          params.eduName = [params.eduName];
          params.eduCompany = [params.eduCompany];
          params.eduStartDate = [params.eduStartDate];
          params.eduEndDate = [params.eduEndDate];
          params.eduDesc = [params.eduDesc];
        }

        params.eduName.forEach(async (name, index) => {
          const sql = `INSERT INTO education (name, company, startDate, endDate, description)
                                      VALUES (:name, :company, :startDate, :endDate, :description)`;
          const replacements = {
            name : name,
            company : params.eduCompany[index],
            startDate : params.eduStartDate[index],
            endDate : params.eduEndDate[index],
            description : params.eduDesc[index],
          };

          await sequelize.query(sql, {
            replacements,
            type:QueryTypes.INSERT,
          });
        });
      }

      // license 자격증 처리
      sql = 'TRUNCATE license';
      await sequelize.query(sql, { type:QueryTypes.DELETE });
      if (params.items && params.items.indexOf("자격증") != -1) {
        //console.log(params);
        if (!(params.licenseName instanceof Array)) {
          params.licenseName = [params.licenseName];
          params.licenseIssue = [params.licenseIssue];
          params.licenseDate = [params.licenseDate];
        }

        params.licenseName.forEach(async (name, index) => {
          const sql = `INSERT INTO license (name, issue, date)
                                    VALUES (:name, :issue, :date)`;
          const replacements = {
            name: name,
            issue : params.licenseIssue[index],
            date : params.licenseDate[index],
          };

          await sequelize.query(sql, {
            replacements,
            type:QueryTypes.INSERT,
          });
        });
      }

      // award 수상내역 처리
      sql = 'TRUNCATE award';
      await sequelize.query(sql, { type:QueryTypes.DELETE });
      if (params.items && params.items.indexOf("수상") != -1) {
        //console.log(params);
        if (!(params.awardName instanceof Array)) {
          params.awardName = [params.awardName];
          params.awardCompany = [params.awardCompany];
          params.awardYear = [params.awardYear];
          params.awardDesc = [params.awardDesc];
        }

        params.awardName.forEach(async (name, index) => {
          const sql = `INSERT INTO award (name, company, year, description)
                                VALUES (:name, :company, :year, :description)`;
          const replacements = {
            name : name,
            company : params.awardCompany[index],
            year : params.awardYear[index],
            description : params.awardDesc[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // overseas 해외경험 처리
      sql = 'TRUNCATE overseas';
      await sequelize.query(sql, { type:QueryTypes.DELETE });
      if (params.items && params.items.indexOf("해외경험") != -1) {
        //console.log(params);
        if (!(params.overseasName instanceof Array)) {
          params.overseasName = [params.overseasName];
          params.overseasStartDate = [params.overseasStartDate];
          params.overseasEndDate = [params.overseasEndDate];
          params.overseasDesc = [params.overseasDesc];
        }

        params.overseasName.forEach(async (name, index) => {
          const sql = `INSERT INTO overseas (name, startDate, endDate, description)
                                    VALUES (:name, :startDate, :endDate, :description)`;
          const replacements = {
            name : name,
            startDate : params.overseasStartDate[index],
            endDate : params.overseasEndDate[index],
            description : params.overseasDesc[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // language 어학 관련 처리
      sql = 'TRUNCATE language';
      await sequelize.query(sql, { type : QueryTypes.DELETE });
      if (params.items && params.items.indexOf("어학") != -1) {
        //console.log(params);
        if (!(params.languageType instanceof Array)) {
          params.languageType = [params.languageType];
          params.languageName = [params.languageName];
          params.languageAbility = [params.languageAbility];
        }

        params.languageType.forEach(async (type, index) => {
          const sql = `INSERT INTO language (type, name, ability)
                                    VALUES (:type, :name, :ability)`;
          const replacements = {
            type : type,
            name : params.languageName[index],
            ability : params.languageAbility[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // portfolio 포트폴리오 처리
      sql = 'TRUNCATE portfolio';
      await sequelize.query(sql, { type : QueryTypes.DELETE });
      if (params.items && params.items.indexOf("포트폴리오") != -1) {
        //console.log(params);
        if (!(params.portfolioTitle instanceof Array)) {
          params.portfolioTitle = [params.portfolioTitle];
          params.portfolioUrl = [params.portfolioUrl];
          params.portfolioDesc = [params.portfolioDesc];
        }

        params.portfolioTitle.forEach(async (title, index) => {
          const sql = `INSERT INTO portfolio (title, url, description)
                                    VALUES (:title, :url, :description)`;
          const replacements = {
            title : title,
            url : params.portfolioUrl[index],
            description : params.portfolioDesc[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      // introduction 자기소개서
      sql = 'TRUNCATE introduction';
      await sequelize.query(sql, { type:QueryTypes.DELETE });
      if (params.items && params.items.indexOf("자기소개서") != -1) {
        //console.log(params);
        if (!(params.introductionTitle instanceof Array)) {
          params.introductionTitle = [params.introductionTitle];
          params.introduction = [params.introduction];
        }

        params.introductionTitle.forEach(async (title, index) => {
          const sql = `INSERT INTO introduction (title, introduction)
                                      VALUES (:title, :introduction)`;
          const replacements = {
            title : title,
            introduction : params.introduction[index],
          };

          await sequelize.query(sql, {
            replacements,
            type : QueryTypes.INSERT,
          });
        });
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  /**
  * 저장된 이력서 데이터
  *
  */
  get : async function() {
    const tables = [
      'basicinfo',
      'school',
      'award',
      'education',
      'intern',
      'introduction',
      'jobhistory',
      'language',
      'license',
      'overseas',
      'portfolio',
    ];

    const data = {};
    try {
      for (let i = 0; i < tables.length; i++ ) {
        table = tables[i];
        let sql = `SELECT * FROM ` + table;
        if (table != 'basicinfo') {
          sql += " ORDER BY idx";
        }

        const rows = await sequelize.query(sql, {
          type : QueryTypes.SELECT,
        });

        //console.log(rows);
        if (table == 'basicinfo') { // 기본 인적사항 -> 레코드 1개
          data[table] = rows[0];
          data[table].benefit = data[table].benefit?data[table].benefit.split("||"):[];
        } else { // 나머지는 레코드 여러개
          data[table] = rows;
        }
      }
    } catch (err) {
      return {};
    }
    // 프로필 이미지
    try {
      await fs.access(path.join(__dirname, "../public/profile/profile"), contants.F_OK);
      data['profile'] = "/profile/profile";
    } catch (err) {}
    //console.log(data);
    return data;
  },
};

module.exports = resume;
