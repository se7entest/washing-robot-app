import sys
sys.path.insert(0, r'C:\Users\Administrator\AppData\Local\Programs\Python\Python312\Lib\site-packages')

try:
    from moviepy.editor import VideoFileClip
    import os

    video_path = r'c:/Users/Administrator/Desktop/2025_11_22_12_16_31_IMG_2390.MP4'
    output_path = r'c:/Users/Administrator/Desktop/微信小程序端/data/video_clipped_20s.mp4'

    print(f'正在读取视频: {video_path}')

    # 读取视频信息
    clip = VideoFileClip(video_path)
    duration = clip.duration
    size = clip.size
    fps = clip.fps
    print(f'视频时长: {duration:.1f}秒')
    print(f'分辨率: {size[0]}x{size[1]}')
    print(f'帧率: {fps}fps')

    # 剪辑前20秒
    if duration > 20:
        final_clip = clip.subclip(0, 20)
        print(f'剪辑完成: 0-20秒')
    else:
        final_clip = clip
        print(f'视频全长: {duration:.1f}秒，无需剪辑')

    # 保存
    print(f'正在保存: {output_path}')
    final_clip.write_videofile(
        output_path,
        codec='libx264',
        audio_codec='aac',
        temp_audiofile='temp-audio.m4a',
        remove_temp=True,
        logger=None
    )

    clip.close()
    final_clip.close()

    print(f'\n✅ 完成! 文件已保存到: {output_path}')
    print(f'文件大小: {os.path.getsize(output_path)/1024/1024:.1f}MB')

except Exception as e:
    print(f'错误: {e}')
    import traceback
    traceback.print_exc()
