#!/bin/sh

# for MacOS
alias date='gdate'

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
SAVE_DIR_ROOT="gpv_images"
LOG_DIR="log"
LOG_FILE="error_log.txt"

year=`date -d '3 hours ago' +'%Y'`
month=`date -d '3 hours ago' +'%m'`
day=`date -d '3 hours ago' +'%d'`
hour=`date -d '3 hours ago' +'%H'`

if [ ! -d ${LOG_DIR} ]; then
  mkdir -p ${LOG_DIR}
fi

for type in ${TYPE[@]}
do
  for area in ${AREA[@]}
  do
    url_html=${GPV_URL}/msm_${type}_${area}_${year}${month}${day}${hour}.html
    response=`curl -s -o /dev/null -w "%{http_code}" ${url_html}`

    if [ ${response} = "200" ]; then
      filename=`curl -s ${url_html} | grep "fnl\[1\]" | awk -F'["]' '{print $2}'`
      save_dir=${SAVE_DIR_ROOT}/${type}/${area}/${year}/${month}/${day}

      if [ ! -d ${save_dir} ]; then
        mkdir -p ${save_dir}
      fi

      curl -s -o "./${save_dir}/${filename}" ${GPV_URL}/msm/${filename}

      if [ ! -e ${save_dir}/${filename} ]; then
        echo "`date +'%F %T'` : failed to download ${filename}" >> ${LOG_DIR}/${LOG_FILE}
      fi
    else
        echo "`date +'%F %T'` : failed to download ${url_html}" >> ${LOG_DIR}/${LOG_FILE}
    fi
  done
done
