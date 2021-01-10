#!/bin/sh

# for MacOS (comment out the following line for Linux)
alias date="/usr/local/bin/gdate"

### TYPE ###
# cp: Cloudiness and Precipitation
# th: Temperature and Humidity
# wa: Wind and Atmosphere
readonly TYPE=("cp" "th" "wa")

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
readonly AREA=("dh" "dn" "kh" "mh" "kt" "cb" "kk" "cs" "ks" "on" "to" "is")

readonly GPV_URL="http://weather-gpv.info"
readonly SAVE_DIR_ROOT="./archive/images"
readonly LOG_DIR="./log"
readonly TMP_HTML_FILE="./tmp.html"

function debug_echo () {
  if "${debug}"; then
    echo ${1}
  fi
  return 0
}

debug=false
if [ $# -eq 1 ] && [ ${1} = "--debug" ]; then
  debug=true
fi

if [ ! -d ${LOG_DIR} ]; then
  mkdir -p ${LOG_DIR}
fi

hour_delta=$((`date +'%k'`%3+3))
if [ ${hour_delta} = 5 ] && [ `date +'%-M'` -ge 30 ]; then
  hour_delta=2
fi
debug_echo "hour_delta=${hour_delta}"

readonly YEAR=`date -d "$((hour_delta)) hours ago" +"%Y"`
readonly MONTH=`date -d "$((hour_delta)) hours ago" +"%m"`
readonly DAY=`date -d "$((hour_delta)) hours ago" +"%d"`
readonly HOUR=`date -d "$((hour_delta)) hours ago" +"%k"`
readonly LOG_FILE_PATH="${LOG_DIR}/error_log_`date +'%Y%m%d'`.txt"
debug_echo "LOG_FILE_PATH=${LOG_FILE_PATH}"

for type in ${TYPE[@]}
do
  for area in ${AREA[@]}
  do
    url_html=${GPV_URL}/msm_${type}_${area}_${YEAR}${MONTH}${DAY}`printf %02d ${HOUR}`.html
    debug_echo "url_html=${url_html}"
    response=`curl -s -o ${TMP_HTML_FILE} -w "%{http_code}" ${url_html}`

    if [ ${response} = "200" ]; then
      save_dir="${SAVE_DIR_ROOT}/${type}/${area}/${YEAR}/${MONTH}/${DAY}"
      if [ ! -d ${save_dir} ]; then
        mkdir -p ${save_dir}
      fi

      for ((i=0; i<3; i++))
      do
        filename=`grep "fnl\[$((i+1))\]" ${TMP_HTML_FILE} | awk -F'["]' '{print $2}'`
        debug_echo "filename=${filename}"
        save_hour=`printf %02d $((HOUR+i))`
        save_file_path="${save_dir}/msm_${type}_${area}_${YEAR}${MONTH}${DAY}${save_hour}.png"

        if [ ! -e ${save_file_path} ]; then
          curl -s -o ${save_file_path} ${GPV_URL}/msm/${filename}

          if [ ! -e ${save_file_path} ]; then
            echo "`date +'%F %T'` : failed to download ${filename}" >> ${LOG_FILE_PATH}
            debug_echo "failed to download ${filename}"
          else
            debug_echo "${save_file_path} has been downloaded"
          fi
        else
          debug_echo "${save_file_path} already exists"
        fi
      done
    else
        echo "`date +'%F %T'` : failed to download ${url_html}" >> ${LOG_FILE_PATH}
        debug_echo "failed to download ${url_html}"
    fi

    rm ${TMP_HTML_FILE} > /dev/null 2>&1
  done
done
