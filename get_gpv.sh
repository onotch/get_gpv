#!/bin/sh

# for MacOS (comment out the following line for Linux)
alias date="/usr/local/bin/gdate"

### TYPE ###
# cp: Cloudiness and Precipitation
# th: Temperature and Humidity
# wa: Wind and Atmosphere
TYPE=("cp" "th" "wa")

### AREA ###
# dh: Dohoku
# dn: Donan
# kh: Kita-Tohoku
# mh: Minami-Tohoku
# kt: Kanto
# cb: Chubu
# kk: Kinki
# cs: Chushikoku
# ks: Kyushu
# on: Okinawa
# to: Amami
# is: Izu-Shoto
AREA=("dh" "dn" "kh" "mh" "kt" "cb" "kk" "cs" "ks" "ks" "on" "to" "is")

GPV_URL="http://weather-gpv.info"
SAVE_DIR_ROOT="./archive/images"
LOG_DIR="./log"
TMP_HTML_FILE="./tmp.html"

if [ ! -d ${LOG_DIR} ]; then
  mkdir -p ${LOG_DIR}
fi

hour_delta=$((`date +'%k'`%3+3))
year=`date -d "$((hour_delta)) hours ago" +"%Y"`
month=`date -d "$((hour_delta)) hours ago" +"%m"`
day=`date -d "$((hour_delta)) hours ago" +"%d"`
hour=`date -d "$((hour_delta)) hours ago" +"%k"`
log_file_path="${LOG_DIR}/error_log_`date +'%Y%m%d'`.txt"

for type in ${TYPE[@]}; do
  for area in ${AREA[@]}; do
    url_html=${GPV_URL}/msm_${type}_${area}_${year}${month}${day}`printf %02d ${hour}`.html
    response=`curl -s -o ${TMP_HTML_FILE} -w "%{http_code}" ${url_html}`

    if [ ${response} = "200" ]; then
      save_dir="${SAVE_DIR_ROOT}/${type}/${area}/${year}/${month}/${day}"
      if [ ! -d ${save_dir} ]; then
        mkdir -p ${save_dir}
      fi

      for ((i=0; i<3; i++)); do
        filename=`grep "fnl\[$((i+1))\]" ${TMP_HTML_FILE} | awk -F'["]' '{print $2}'`
        save_hour=`printf %02d $((hour+i))`
        save_file_path="${save_dir}/msm_${type}_${area}_${year}${month}${day}${save_hour}.png"

        curl -s -o ${save_file_path} ${GPV_URL}/msm/${filename}

        if [ ! -e ${save_file_path} ]; then
          echo "`date +'%F %T'` : failed to download ${filename}" >> ${log_file_path}
        fi
      done
    else
        echo "`date +'%F %T'` : failed to download ${url_html}" >> ${log_file_path}
    fi

    rm ${TMP_HTML_FILE} > /dev/null 2>&1
  done
done
