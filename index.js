/*
  POC implementation for logical AND of skills

  Algorithm:
    1. Fetch the keywordIds for every searchTerm (getKeywordId())
        searchTerm_i --> keywordId_i

    2. Fetch the people who have all the skills listed in searchTerm (getSkillsByKeywordIds)


  Usage:
  $ node index.js terraform azure aws

  Example run:
  $ node index.js terraform azure aws
  SEARCH:  [ 'terraform', 'azure', 'aws' ]
  FOUND: 6 people with 
  Eka
    Amazon Web Services 3
    Microsoft Azure 3
    Terraform 4
  Toka
    Amazon Web Services 4
    Microsoft Azure 4
    Terraform 3
  Kolmas
    Amazon Web Services 4
    Microsoft Azure 5
    Terraform 4
  Neljäs
    Amazon Web Services 4
    Microsoft Azure 4
    Terraform 3
  Viides
    Amazon Web Services 4
    Microsoft Azure 3
    Terraform 4
  Kuudes
    Amazon Web Services 4
    Microsoft Azure 3
    Terraform 3
*/
require('dotenv').config()
const axios = require('axios').default;

const BASE_URL = 'https://api.cinode.com';
const companyId = process.env.CINODE_COMPANYID;

// For this PoC we also authentication every time the tool is run
async function authenticate() {
  const accessId = process.env.CINODE_ACCESSID;
  const accessSecret = process.env.CINODE_ACCESSSECRET;
  const authValue = Buffer.from(`${accessId}:${accessSecret}`).toString('base64');

  try {
    const response = await axios.get(`${BASE_URL}/token`,
      {
        headers: { 'Authorization': `Basic ${authValue}` },
      });
    const access_token = response.data.access_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  } catch (err) {
    console.log(`ERROR authenticate :: ${err.message}`);
    process.exit(1);
  }
}

// Fetch the keywordId of searchTerm
async function getKeyWordId(searchTerm) {
  try {
    res = await axios.post(`${BASE_URL}/v0.1/companies/${companyId}/skills/search/term`,
      {
        term: searchTerm,
        limit: 0,
      }
    );
    return res.data.query.skills[0].keywordId;
  } catch (err) {
    console.log(`getKeywordId :: ${searchTerm} :: ${err.message}`);
    process.exit(1);
  }
}

// Fetch the people who AND the keywordIds
async function getSkillsByKeywordIds(keywordIds) {
  const skillsObj = {
    skills: [],
  };
  for (let i = 0; i < keywordIds.length; i++) {
    skillsObj.skills = [...skillsObj.skills, { keywordId: keywordIds[i], min: 3, max:5 }];
  }
  //console.log(skillsObj);

  try {
    const res = await axios.post(`${BASE_URL}/v0.1/companies/${companyId}/skills/search`,
      { skills: skillsObj.skills }
    );

    // Only printing the results here for this PoC
    //console.log(res.data.hits);
    console.log(`FOUND: ${res.data.hits.length} people with `)
    res.data.hits.forEach(x => {
      console.log(x.firstname, x.lastname)
      x.skills.forEach(a => console.log('\t', a.masterSynonymName, a.level));
    });
  } catch (err) {
    console.log(`ERROR getSkillsByKeywordIds :: ${keywordIds} :: ${err.message}`);
    process.exit(1);
  }
}

async function doQuery(searchTerms) {
  await authenticate();

  let keywordIds = [];
  for (let i = 0; i < searchTerms.length; i++) {
    const res = await getKeyWordId(searchTerms[i]);
    keywordIds = [...keywordIds, res];
  }
  await getSkillsByKeywordIds(keywordIds);
}

const searchTerms = process.argv.slice(2);
console.log('SEARCH: ', searchTerms);
doQuery(searchTerms);
