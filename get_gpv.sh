#!/bin/sh

### TYPE ###
# cp: Cloudiness and precipitation
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

year=`date +"%Y"`
month=`date +"%m"`
day=`date +"%d"`
hour=`date +"%H"`

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
        if [ ! -d ${LOG_DIR} ]; then
          mkdir -p ${LOG_DIR}
        fi

        log="failed to download ${filename}."
        echo ${log}
        echo ${log} > ${LOG_DIR}/${LOG_FILE}
      fi
    fi
  done
done
