option(DEBUG "compile for debugging" OFF)
if(DEBUG)
set(CMAKE_CXX_FLAGS "-DDEBUG=1 -DSCANLOG=1 " )
set(CMAKE_BUILD_TYPE Debug)
else()
set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS} -DRELEASE=1 -DNORAWSTREAM=1 -DNOLOG=1 -DRELEASEID=1 -DRELEASEDIR=1 ")
set(CMAKE_BUILD_TYPE Release)
endif()

cmake_minimum_required(VERSION 3.13)
project(Glucodata)
set(MYCFLAGS "-gdwarf-4 -g3  -Wall -Wno-sign-compare -fvisibility=hidden")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS}  ${MYCFLAGS}" )
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}   ${MYCFLAGS} -std=c++20 -fno-rtti  -fexceptions")
set(INCLUDESELF ${CMAKE_CURRENT_SOURCE_DIR})
set(OPENGL_LIB GLESv3)
set(CURVEDIR curve)
set(NETDIR net)
set(log-lib "")
set(LIBASCON ${INCLUDESELF}/LibAscon)
set(APP_STL c++_static)
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY BOTH)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE BOTH)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE BOTH)

set(LIBRE3FILES ${INCLUDESELF}/libre3/bluetooth.cpp ${INCLUDESELF}/libre3/nfc.cpp)


set(ASCONFILES ${LIBASCON}/src/ascon_permutations.c ${LIBASCON}/src/ascon_buffering.c ${LIBASCON}/src/ascon_aead_common.c ${LIBASCON}/src/ascon_aead128a.c)
add_definitions(-DANDROID_STL=c++_static -DDYNLINK  -DUSE_MEAL -DNOTIMEOUT)



add_link_options(-g)







if (${CMAKE_SYSTEM_NAME} MATCHES "DONTUSE")
else()
option(static "compile static" OFF)
add_executable(juggluco ${ASCONFILES} ${NETDIR}/watchserver/watchserver.cpp  ${NETDIR}/watchserver/sslserver.cpp   removeoldstates.cpp nums/numdata.cpp settings/settings.cpp   cmdline/main.cpp share/logs.cpp  ${NETDIR}/netstuff.cpp  ${NETDIR}/sender.cpp ${NETDIR}/sendcommands.cpp ${NETDIR}/backup.cpp ${NETDIR}/getcommand.cpp ${NETDIR}/myip.cpp datbackup.cpp glucose.cpp ${CURVEDIR}/exports.cpp settings/getcountry.cpp  meal/savemeals.cpp share/serial.cpp )
target_include_directories( juggluco PRIVATE  ${INCLUDESELF} ${INCLUDESELF}/share  ${INCLUDESELF}/LibAscon/inc)
add_executable(readlog readlog.cpp)
target_include_directories( readlog PRIVATE  ${INCLUDESELF} ${INCLUDESELF}/share  )
if(static)
target_compile_options(juggluco PUBLIC -static   -pthread  )
target_link_libraries( juggluco     m dl )
target_link_options(juggluco  PUBLIC -static  -Wl,--whole-archive -lpthread  -Wl,--no-whole-archive  )
target_compile_options(readlog PUBLIC  -fopenmp -static)
target_link_options(readlog  PUBLIC   -fopenmp -static )
set(extradefs -DJUSTATIC=1 )
else()
target_compile_options(juggluco PUBLIC   -pthread  )
target_link_libraries( juggluco     m pthread dl  )
target_compile_options(readlog PUBLIC  -fopenmp )
target_link_options(readlog  PUBLIC   -fopenmp  )

endif()
if(SSLXDRIP)
	set(extradefs -DUSE_SSL=1 )
endif()

target_include_directories(juggluco PRIVATE ${INCLUDESELF} ${INCLUDESELF}/share )
set(jugglucodef -DNOJAVA -DNOTAPP -DDONTSCALESTROKEWIDTH -DDONT_USE_LIBREVIEW=1)

target_compile_definitions( juggluco  PRIVATE  ${jugglucodef} ${extradefs})
get_target_property(sourjug juggluco SOURCE)
message(STATUS  ${sourjug})
set(NETPATH ${INCLUDESELF}/${NETDIR})
set(CURVEPATH ${INCLUDESELF}/${CURVEDIR})
set(depfiles ${INCLUDESELF}/readlog.cpp ${ASCONFILES} ${INCLUDESELF}/removeoldstates.cpp  ${INCLUDESELF}/nums/numdata.cpp ${INCLUDESELF}/settings/settings.cpp   ${INCLUDESELF}/cmdline/main.cpp ${INCLUDESELF}/share/logs.cpp  ${NETPATH}/watchserver/watchserver.cpp ${NETPATH}/watchserver/sslserver.cpp  ${NETPATH}/netstuff.cpp  ${NETPATH}/sender.cpp ${NETPATH}/sendcommands.cpp ${NETPATH}/backup.cpp ${NETPATH}/getcommand.cpp ${NETPATH}/myip.cpp ${INCLUDESELF}/datbackup.cpp ${INCLUDESELF}/glucose.cpp ${CURVEPATH}/exports.cpp ${INCLUDESELF}/settings/getcountry.cpp  ${INCLUDESELF}/meal/savemeals.cpp ${INCLUDESELF}/share/serial.cpp  ${INCLUDESELF}/net/libreview/libreview.cpp)
add_custom_target(cmdlinesrc.tar make -f ${CMAKE_CURRENT_BINARY_DIR}/juggluco-dep doel DEPENDS juggluco-dep)
endif()




